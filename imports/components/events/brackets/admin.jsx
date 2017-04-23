import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import ParticipantAction from "./admin_comps/participants.jsx";
import AdvancedAction from "./admin_comps/advanced_action.jsx";
import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import EditStaffAction from "./admin_comps/edit_staff.jsx";
import BracketAction from "../show/bracket.jsx";
import BracketOptions from "./admin_comps/options.jsx";
import BracketEdit from "./admin_comps/bracket.jsx";

import Restart from "./admin_comps/restart.jsx";
import Finalize from "./admin_comps/finalize.jsx";

import MatchList from "./admin_comps/matches.jsx";
import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";
import LosersBracket from "/imports/components/tournaments/double/losers.jsx";
import Toggle from "/imports/components/tournaments/double/toggle.jsx";

import ShareOverlay from "/imports/components/public/share_overlay.jsx";

import Brackets from "/imports/api/brackets/brackets.js";

import Instances from "/imports/api/event/instance.js";

import OrganizeSuite from "/imports/decorators/organize.js";
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import LoaderContainer from "/imports/components/public/loader_container.jsx";

class BracketAdminScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false
    }
  }

  componentWillUnmount() {
    if(this.state.sub){
      this.state.sub.stop();
    }
  }

  participantItem(bracket) {
    return {
      name: "Participants",
      icon: "users",
      key: "participants",
      subItems: [
        {
          content: ParticipantAction,
          name: "Participants",
          args: {
            index: this.props.params.bracketIndex || 0,
            bracket,
            onStart: () => {
              var instanceId = Instances.findOne()._id;
              this.state.sub = Meteor.subscribe("bracketContainer", instanceId, this.props.params.bracketIndex || 0, {
                onReady: () => {
                  this.forceUpdate();
                }
              })
            }
          }
        }
      ]
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

  bracketItem(bracket, index, rounds) {
    var subs;
    const participantList = Instances.findOne().brackets[this.props.params.bracketIndex || 0].participants || [];
    var partMap = {};
    participantList.forEach((p, i) => {
      partMap[p.alias] = i + 1;
    })
    var args = {
      id: bracket.id,
      index,
      eid: this.props.params.eventId,
      update: this.forceUpdate.bind(this),
      format: bracket.format.baseFormat,
      rounds,
      complete: bracket.isComplete,
      page: "admin",
      partMap,
      stretch: true,
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
          //   name: "",
          //   ignoreHeader: true
          // }
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

  matchesItem(bracket) {
    var partMap = {};
    const participantList = Instances.findOne().brackets[this.props.params.bracketIndex || 0].participants || [];
    participantList.forEach((p, i) => {
      partMap[p.alias] = i + 1;
    })
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
            format: bracket.format.baseFormat,
            partMap
          }
        }
      ]
    }
  }

  advancedItem(bracket) {
    return {
      name: "Advanced Options",
      key: "advanced",
      icon: "cubes",
      subItems: [
        {
          content: AdvancedAction,
          args: {
            index: this.props.params.bracketIndex || 0,
            bracket,
          }
        }
      ]

    }
  }

  logisticsItem(bracket, index) {
    return {
      name: "Logistics",
      key: "logistics",
      icon: "edit",
      subItems: [
        {
          content: Finalize,
          name: "Finalize",
          args: {
            index
          }
        },
        {
          content: Restart,
          name: "Restart",
          args: {
            index,
            onStart: () => {
              var instanceId = Instances.findOne()._id;
              if(this.state.sub) {
                this.state.sub.stop();
              }
              this.state.sub = Meteor.subscribe("bracketContainer", instanceId, this.props.params.bracketIndex || 0, {
                onReady: () => {
                  this.forceUpdate();
                }
              })
            }
          }
        }
      ]
    }
  }

  optionItem(bracket, index) {
    return {
      name: "Options",
      key: "options",
      icon: "cog",
      subItems: [
        {
          content: BracketEdit,
          args: {
            bracket,
            index,
            onStart: () => {
              var instanceId = Instances.findOne()._id;
              if(this.state.sub) {
                this.state.sub.stop();
              }
              this.state.sub = Meteor.subscribe("bracketContainer", instanceId, index, {
                onReady: () => {
                  this.forceUpdate();
                }
              })
            }
          }
        }
      ]
    }
  }

  items() {
    const instance = Instances.findOne();
    var index = this.props.params.bracketIndex || 0;
    var bracket = instance.brackets[index];
    var defaultItems = [];
    if(bracket.isComplete) {
      defaultItems.push(this.leaderboardItem(bracket, index));
    }

    var rounds;
    const format = bracket.format.baseFormat;
    if((format == "single_elim" || format == "double_elim") && bracket.participants && bracket.participants.length > 3) {
      if(!bracket.id) {
        switch(format) {
          case "single_elim": rounds = OrganizeSuite.singleElim(bracket.participants || []); break;
          case "double_elim": rounds = OrganizeSuite.doubleElim(bracket.participants || []); break;
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
        var rounds = Brackets.findOne().rounds;
      }
      defaultItems.push(this.bracketItem(bracket, index, rounds));
    }
    if(format == "swiss" || format == "round_robin" && bracket.id) {
      var rounds = Brackets.findOne().rounds;
      defaultItems.push(this.bracketItem(bracket, index, rounds));
    }
    defaultItems.push(this.participantItem(bracket));
    if (bracket.format.baseFormat == "swiss")
      defaultItems.push(this.advancedItem(bracket));


    if(bracket.id) {
      if (bracket.format.baseFormat != "swiss" && bracket.format.baseFormat != "round_robin")
        defaultItems.push(this.matchesItem(bracket));
      if(!bracket.isComplete) {
        defaultItems.push(this.logisticsItem(bracket, index));
      }
    }
    defaultItems.push(this.optionItem(bracket, index))
    // defaultItems.push({
    //   text: "Back To Event",
    //   action: () => {
    //     browserHistory.push(`/event/${Events.findOne().slug}`);
    //   }
    // })
    return defaultItems;
  }

  actions() {
    var actions = [];
    const event = Events.findOne();
    if(event) {
      actions.push({
        name: "Back To Event",
        icon: "arrow-left",
        action: () => {
          browserHistory.push("/event/" + Events.findOne().slug);
        }
      })
    }
    actions.push({
      name: "Short URL",
      icon: "link",
      action: (e) => {
        if(!this.state.url) {
          var path = window.location.pathname;
          path = path.substring(0, path.indexOf("/admin"));
          Meteor.call("generateShortLink", path, (err, data) => {
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
    return actions;
  }

  render() {
    if(!this.props.ready) {
      return (
        <LoaderContainer ready={this.props.ready} onReady={() => { this.setState({ready: true}) }} />
      )
    }
    return (
      <div style={{padding: 10, height: "100%"}}>
        <CreateContainer items={this.items()} actions={this.actions()} stretch={true} />
        <ShareOverlay open={this.state.open} onClose={() => { this.setState({ open: false }) }} url={this.state.url} />
      </div>
    );
  }
}

const x = createContainer(({params}) => {
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


}, BracketAdminScreen);

export default DragDropContext(HTML5Backend)(x)
