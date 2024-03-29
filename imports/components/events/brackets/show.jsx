import React, { Component } from "react";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data"
import Modal from "react-modal";

import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";

import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";
import LosersBracket from "/imports/components/tournaments/double/losers.jsx";
import Toggle from "/imports/components/tournaments/double/toggle.jsx";

import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import MatchList from "./admin_comps/matches.jsx";

import { formatter } from "/imports/decorators/formatter.js";

import Brackets from "/imports/api/brackets/brackets.js"
import CreateContainer from "/imports/components/public/create/create_container.jsx";

import ShareOverlay from "/imports/components/public/share_overlay.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";

import OrganizeSuite from "/imports/decorators/organize.js";
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import LoaderContainer from "/imports/components/public/loader_container.jsx";

import Games from "/imports/api/games/games.js";

class BracketShowScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentWillUnmount() {
    if(this.state.event) {
      this.state.event.stop();
    }
    if(this.refs.hiddenLink) {
      this.refs.hiddenLink.removeEventListener("click");
    }
    document.title="Brachyon"
  }

  participantsItem(bracket) {
    return {
      name: "Participants",
      icon: "users",
      key: "participants",
      subItems: [
        {
          content: ParticipantList,
          name: "Participants",
          args: {
            participants: bracket.participants || []
          }
        }
      ]
    }
  }

  bracketItem(bracket, index, rounds) {
    var subs;
    var partMap = {};
    const participantList = Instances.findOne().brackets[index].participants || [];
    participantList.forEach((p, i) => {
      partMap[p.alias] = i + 1;
    });
    var instance = Instances.findOne();
    var args = {
      id: bracket.id,
      eid: instance.event,
      format: bracket.format.baseFormat,
      rounds,
      complete: bracket.isComplete,
      page: "admin",
      partMap,
      full: true
    };
    switch(bracket.format.baseFormat) {
      case "single_elim":
        subs = [
          {
            content: WinnersBracket,
            args
          }
        ];
        break;
      case "double_elim":
        subs = [
          {
            content: WinnersBracket,
            name: "Winners",
            ignoreHeader: true,
            args
          },
          {
            content: LosersBracket,
            name: "Losers",
            ignoreHeader: true,
            args
          }
          // {
          //   content: Toggle,
          //   name: "toggle",
          //   ignoreHeader: true
          // }
        ];
        break;
      default:
        subs = [
          {
            content: BracketPanel,
            args
          }
        ];
        break;
    }
    return {
      name: "Bracket",
      icon: "sitemap",
      key: "bracket",
      subItems: subs
    }
  }

  leaderboardItem(bracket, index) {
    return {
      name: "Leaderboard",
      icon: "trophy",
      key: "leaderboard",
      subItems: [
        {
          content: LeaderboardAction,
          name: "Leaderboard",
          args: {
            id: bracket.id,
            index: index
          }
        }
      ]
    }
  }

  matchesItem(bracket) {
    return {
      name: "Matches",
      key: "matches",
      icon: "cubes",
      subItems: [
        {
          content: MatchList,
          name: "Matches",
          args: {
            id: bracket.id,
            format: bracket.format.baseFormat
          }
        }
      ]
    }
  }

  items() {
    var instance = Instances.findOne();
    var bracket = Brackets.findOne() || {};
    var index = instance.brackets.findIndex(o => {
      return o.slug == this.props.params.slug;
    }) || 0;
    console.log(index);
    var bracketMeta = instance.brackets[index];
    var defaultItems = [];
    var id = bracketMeta.id;

    var rounds;
    if(bracketMeta.participants && bracketMeta.participants.length > 3) {
      if(!id) {
        switch(bracketMeta.format.baseFormat) {
          case "single_elim": rounds = OrganizeSuite.singleElim(bracketMeta.participants || []); break;
          case "double_elim": rounds = OrganizeSuite.doubleElim(bracketMeta.participants || []); break;
          default: break;
        }
        var count = 1;

        var tempRounds = [];

        tempRounds[0] = rounds[0].map((r, i) => {
          return r.map((m, j) => {
            const isFirstRound = i == 0 && m.playerOne && m.playerTwo;
            if(isFirstRound || i > 0) {
              return {
                players: [m.playerOne, m.playerTwo],
                winner: null,
                id: count ++,
                losm: m.losm,
                losr: m.losr
              }
            }
            return null;
          })
        });

        if(rounds[1]) {
          tempRounds[1] = rounds[1].map((r, i) => {
            return r.map(m => {
              if(!m.truebye && i <= 1) {
                return null;
              }
              return {
                players: [null, null],
                winner: null,
                id: count ++
              }
            })
          })
        }
        if(rounds[2]) {
          tempRounds[2] = rounds[2].map(r => {
            return r.map(m => { return {
              players: [null, null],
              winner: null,
              id: count ++
            } })
          })
        }
        rounds = tempRounds;
      }
      else {
        rounds = Brackets.findOne(id).rounds;
      }
      defaultItems.push(this.bracketItem(bracketMeta, index, rounds));
    }
    defaultItems.push(this.participantsItem(bracketMeta));
    if(bracketMeta.isComplete) {
      defaultItems.push(this.leaderboardItem(bracketMeta, index));
    }
    // if(bracketMeta.id && (bracketMeta.format.baseFormat == "single_elim" || bracketMeta.format.baseFormat == "double_elim")) {
    //   defaultItems.push(this.matchesItem(bracketMeta));
    // }
    return defaultItems;
  }

  actions() {
    //var index = this.props.params.bracketIndex || 0;
    var instance = Instances.findOne();
    var index = instance.brackets.findIndex(o => {
      return o.slug == this.props.params.slug;
    }) || 0;
    var bracketMeta = instance.brackets[index];

    var items = [];

    const event = Events.findOne();
    if(event) {
      items.push({
        name: "Back to Event",
        icon: "arrow-left",
        action: () => {
          browserHistory.push("/event/" + Events.findOne().slug);
        }
      });
    }

    if(!bracketMeta.id) {
      var registered = (bracketMeta.participants || []).findIndex(p => {
        return p.id == Meteor.userId();
      })
      if(registered >= 0 && Meteor.userId()) {
        items.push({
          name: "Unregister",
          icon: "user-times",
          action: () => {
            Meteor.call("events.removeParticipant", Events.findOne()._id, index, Meteor.userId(), (err) => {
              if(err) {
                toastr.error(err.reason);
              }
              else {
                toastr.success("Unregistered for event!");
              }
            })
          }
        })
      }
      else {
        const event = Events.findOne();
        if(event) {
          const privacy = (event.details.privacy || {}).type || "public";
          if(privacy == "public") {
            items.push({
              name: "Register",
              icon: "user-plus",
              action: () => {
                if(Meteor.userId()) {
                  this.registerUser();
                }
                else {
                  this.setState({
                    open: true
                  })
                }
              }
            })
          }
          else if(privacy == "private" && event.details.privacy.contactLink) {
            items.push({
              name: "Contact",
              icon: "phone",
              action: () => {
                window.open(event.details.privacy.contactLink);
              }
            })
          }
        }

      }
    }
    items.push({
      name: "Short URL",
      icon: "link",
      action: (e) => {
        if(!this.state.url) {
          Meteor.call("generateShortLink", window.location.pathname, (err, data) => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              this.setState({
                open: true,
                url: data
              })
            }
          });
        }
        else {
          this.setState({
            open: true
          })
        }
      }
    })
    return items;
  }

  registerUser() {
    var instance = Instances.findOne();
    var index = instance.brackets.findIndex(o => {
      return o.slug == this.props.params.slug;
    }) || 0;
    Meteor.call("events.registerUser", Events.findOne()._id, index, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Registered for event!");
      }
    })
  }

  render() {
    if(!this.props.ready) {
      return (
        <LoaderContainer ready={this.props.ready} onReady={() => {
          this.populateMetaTags();
          this.setState({
            ready: true
          })
        }} />
      )
    }
    return (
      <div style={{padding: 10}}>
        <CreateContainer items={this.items()} actions={this.actions()} stretch={true} />
        <ShareOverlay open={this.state.open} onClose={() => { this.setState({ open: false }) }} url={this.state.url} />
        <RegModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} onSuccess={this.registerUser.bind(this)} />
      </div>
    );
  }
}

const x = createContainer((props) => {
  const { slug } = props.params;
  const instanceHandle = Meteor.subscribe("bracketContainer", slug, {
    onReady: () => {
      const instance = Instances.findOne({
        "brackets.slug": slug
      });
      const index = instance.brackets.findIndex(o => { return o.slug == slug });
      const bracketMeta = Instances.findOne().brackets[index];
      if(bracketMeta.name){
        document.title=bracketMeta.name+ " | Brachyon"
      }
      else {
        document.title = Games.findOne({_id:bracketMeta.game}).name + " | Brachyon"
      }
    }
  });
  return {
    ready: instanceHandle.ready()
  }
}, BracketShowScreen);

export default DragDropContext(HTML5Backend)(x)
