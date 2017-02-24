import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import ParticipantAction from "./admin_comps/participants.jsx";
import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import EditStaffAction from "./admin_comps/edit_staff.jsx";
import StartBracketAction from "./admin_comps/start.jsx";
import BracketAction from "../show/bracket.jsx";

import LogisticsPanel from "./admin_comps/logistics.jsx";
import Restart from "./admin_comps/restart.jsx";
import Finalize from "./admin_comps/finalize.jsx";

import MatchList from "./admin_comps/matches.jsx";
import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";
import LosersBracket from "/imports/components/tournaments/double/losers.jsx";

import Brackets from "/imports/api/brackets/brackets.js";

import Instances from "/imports/api/event/instance.js";

import OrganizeSuite from "/imports/decorators/organize.js";

class BracketAdminScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: true
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
    var args = {
      id: bracket.id,
      eid: this.props.params.eventId,
      format: bracket.format.baseFormat,
      rounds,
      complete: bracket.isComplete
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
            args
          },
          {
            content: LosersBracket,
            name: "Losers",
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

  matchesItem(bracket) {
    return {
      name: "Matches",
      key: "matches",
      icon: "cubes",
      subItems: [
        {
          content: MatchList,
          args: {
            id: bracket.id,
            format: bracket.format.baseFormat
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

  items() {
    const instance = Instances.findOne();
    var index = this.props.params.bracketIndex || 0;
    var bracket = instance.brackets[index];
    var defaultItems = [];
    defaultItems.push(this.participantItem(bracket));
    if(bracket.isComplete) {
      defaultItems.push(this.leaderboardItem(bracket, index));
    }

    var rounds;
    if(bracket.participants && bracket.participants.length > 3) {
      if(!bracket.id) {
        switch(bracket.format.baseFormat) {
          case "single_elim": rounds = OrganizeSuite.singleElim(bracket.participants || []); break;
          case "double_elim": rounds = OrganizeSuite.doubleElim(bracket.participants || []); break;
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
        var rounds = Brackets.findOne().rounds;
      }
      defaultItems.push(this.bracketItem(bracket, index, rounds));
    }

    if(bracket.id) {
      defaultItems.push(this.matchesItem(bracket));
      if(!bracket.isComplete) {
        defaultItems.push(this.logisticsItem(bracket, index));
      }

    }
    // defaultItems.push({
    //   text: "Back To Event",
    //   action: () => {
    //     browserHistory.push(`/event/${Events.findOne().slug}`);
    //   }
    // })
    return defaultItems;
  }

  actions() {
    return [
      {
        name: "Back To Event",
        action: () => {
          browserHistory.push("/event/" + Events.findOne().slug);
        }
      }
    ]
  }

  render() {
    const { ready } = this.props;
    if(!ready || !this.state.ready) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div style={{padding: 20, height: "calc(100vh - 100px)", overflowY: "auto"}}>
        <CreateContainer items={this.items()} actions={this.actions()} />
      </div>
    );
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


}, BracketAdminScreen);
