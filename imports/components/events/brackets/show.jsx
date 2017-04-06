import React, { Component } from "react";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data"
import Modal from "react-modal";

import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";

import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";
import LosersBracket from "/imports/components/tournaments/double/losers.jsx";

import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import MatchList from "./show/matches.jsx";

import { formatter } from "/imports/decorators/formatter.js";
import { generateMetaTags, resetMetaTags } from "/imports/decorators/meta_tags.js";

import Brackets from "/imports/api/brackets/brackets.js"
import CreateContainer from "/imports/components/public/create/create_container.jsx";
import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import OrganizeSuite from "/imports/decorators/organize.js";

class BracketShowScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  componentWillReceiveProps() {
    this.populateMetaTags();
  }

  componentWillUnmount() {
    if(this.state.event) {
      this.state.event.stop();
    }
    if(this.state.bracket) {
      this.state.bracket.stop();
    }
    if(this.refs.hiddenLink) {
      this.refs.hiddenLink.removeEventListener("click");
    }
    resetMetaTags();
  }

  imgOrDefault() {
    var event = Events.findOne();
    if(event && event.details.bannerUrl) {
      return event.details.bannerUrl;
    }
    return "/images/brachyon_logo.png";
  }

  populateMetaTags() {
    var event = Events.findOne();
    var bracket = Instances.findOne().brackets[this.props.params.bracketIndex];

    if(!event) {
      this.setState({
        hasLoaded: true
      });
      return;
    }

    var title = event.details.name + (bracket.name ? ` - ${bracket.name}` : "");
    var format = formatter(bracket.format.baseFormat);
    var img = this.imgOrDefault();
    var url = window.location.href;

    generateMetaTags(title, format, img, url);

    this.setState({
      hasLoaded: true
    })
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
    var args = {
      id: bracket.id,
      eid: this.props.params.eventId,
      format: bracket.format.baseFormat,
      rounds,
      complete: bracket.isComplete,
      page: "admin"
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
        ];
        break;
      default:
        subs = [
          {
            content: BracketAction,
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
    var bracketMeta = instance.brackets[this.props.params.bracketIndex || 0];
    var defaultItems = [];
    var id = bracketMeta.id;

    var rounds;
    if(bracketMeta.participants && bracketMeta.participants.length > 3) {
      if(!bracketMeta.id) {
        switch(bracketMeta.format.baseFormat) {
          case "single_elim": rounds = OrganizeSuite.singleElim(bracketMeta.participants); break;
          case "double_elim": rounds = OrganizeSuite.doubleElim(bracketMeta.participants); break;
          default: break;
        }
        rounds = rounds.map(b => {
          return b.map(r => {
            return r.map(m => {
              if(m) {
                return {
                  players: [m.playerOne, m.playerTwo],
                  winner: null
                }
              }
              return null;
            })
          })
        })
      }
      else {
        rounds = Brackets.findOne().rounds;
      }
      defaultItems.push(this.bracketItem(bracketMeta, this.props.params.bracketIndex || 0, rounds));
    }
    defaultItems.push(this.participantsItem(bracketMeta));
    if(bracketMeta.isComplete) {
      defaultItems.push(this.leaderboardItem(bracketMeta, this.props.params.bracketIndex || 0));
    }
    if(bracketMeta.id) {
      defaultItems.push(this.matchesItem(bracketMeta));
    }
    return defaultItems;
  }

  actions() {
    var index = this.props.params.bracketIndex || 0;
    var instance = Instances.findOne();
    var bracketMeta = instance.brackets[index];

    var items = [];

    if(!bracketMeta.id) {
      var registered = (bracketMeta.participants || []).findIndex(p => {
        return p.id == Meteor.userId();
      })
      if(registered >= 0) {
        items.push({
          name: "Unregister",
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
        items.push({
          name: "Register",
          action: () => {
            Meteor.call("events.registerUser", Events.findOne()._id, index, (err) => {
              if(err) {
                toastr.error(err.reason);
              }
              else {
                toastr.success("Registered for event!");
              }
            })
          }
        })
      }
    }
    items.push({
      name: "Back to Event",
      action: () => {
        browserHistory.push("/event/" + Events.findOne().slug);
      }
    });
    items.push({
      name: "Generate Short URL",
      action: (e) => {

        Meteor.call("generateShortLink", window.location.pathname, (err, data) => {
          if(err) {
            toastr.error(err.reason);
          }
          else {
            this.setState({
              open: true,
              url: window.location.origin + "/!" + data
            })
          }
        });
      }
    })
    return items;
  }

  render() {
    if(this.props.ready) {
      return (
        <div style={{padding: 20}}>
          <CreateContainer items={this.items()} actions={this.actions()} />
          <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }} style={{
            content: {
              width: 300,
              height: 100
            }
          }}>
            <div className="col center x-center" style={{width: "100%", height: "100%"}}>
              <input value={this.state.url} style={{fontSize: 12, width: "100%", margin: 0, textAlign: "center"}} onFocus={(e) => {
                e.target.select();
              }} />
            </div>
          </Modal>
        </div>
      );
    }
    else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

export default createContainer(({params}) => {
  const { slug, bracketIndex } = params;

  if(slug) {
    const eventHandle = Meteor.subscribe("event", slug);
    if(eventHandle && eventHandle.ready()) {
      const instanceHandle = Meteor.subscribe("bracketContainer", Events.findOne().instances.pop(), bracketIndex);
      return {
        ready: instanceHandle.ready(),
        instance: Instances.findOne(),
        bracket: Brackets.findOne(),
        event: Events.findOne()
      }
    }
    return {
      ready: false
    }
  }
  else {
    const { id } = params;
    const instanceHandle = Meteor.subscribe("bracketContainer", id, 0);
    return {
      ready: instanceHandle.ready()
    }
  }
}, BracketShowScreen);
