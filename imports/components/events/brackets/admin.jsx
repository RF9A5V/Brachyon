import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { browserHistory } from "react-router";
import { createContainer } from "meteor/react-meteor-data";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import ParticipantAction from "./admin_comps/participants.jsx";
import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import EditStaffAction from "./admin_comps/edit_staff.jsx";
import StartBracketAction from "./admin_comps/start.jsx";
import BracketAction from "../show/bracket.jsx";
import LogisticsPanel from "./admin_comps/logistics.jsx";
import MatchList from "./admin_comps/matches.jsx";

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

  items() {
    const { instance } = this.props;
    var index = this.props.params.bracketIndex || 0;
    var bracket = instance.brackets[index];
    var defaultItems = [];
    if(bracket.endedAt == null) {
      defaultItems.push({
        text: "Participants",
        icon: "users",
        subitems: [
          {
            component: ParticipantAction,
            args: {
              index: this.props.params.bracketIndex || 0,
              bracket,
              onStart: {
                func: () => {
                  this.setState({
                    sub: Meteor.subscribe("bracketContainer", Events.findOne().instances.pop(), this.props.params.bracketIndex)
                  });
                }
              }
            }
          }
        ]
      })
    }
    else {
      defaultItems.push({
        text: "Leaderboard",
        icon: "trophy",
        subitems: [
          {
            component: LeaderboardAction,
            args: {
              id: bracket.id,
              index: index
            }
          }
        ]
      })
    }

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
    }
    defaultItems.push({
      text: "Bracket",
      icon: "sitemap",
      subitems: [
        {
          component: BracketAction,
          args: {
            id: bracket.id,
            eid: this.props.params.eventId,
            format: bracket.format.baseFormat,
            rounds
          }
        }
      ]
    })

    if(bracket && bracket.id) {
      if(bracket.format.baseFormat == "single_elim" || bracket.format.baseFormat == "double_elim") {
        defaultItems.push({
          text: "Matches",
          icon: "cubes",
          subitems: [
            {
              component: MatchList,
              args: {
                id: bracket.id,
                format: bracket.format.baseFormat
              }
            }
          ]
        });
      }
    }
    if(bracket.endedAt == null && bracket.startedAt != null) {
      defaultItems = defaultItems.concat([
        {
          text: "Logistics",
          icon: "edit",
          subitems: [
            {
              component: LogisticsPanel,
              args: {
                index: index
              }
            }
          ]
        }
      ])
    }
    else if(bracket.endedAt == null && bracket.startedAt == null) {
      defaultItems = defaultItems.concat([
        {
          text: "Start",
          icon: "sign-in",
          subitems: [
            {
              component: StartBracketAction,
              args: {
                index: index,
                onStart: {
                  func: () => {
                    this.setState({
                      sub: Meteor.subscribe("bracketContainer", Events.findOne().instances.pop(), this.props.params.bracketIndex)
                    });
                  }
                }
              }
            }
          ]
        }
      ])
    }
    defaultItems.push({
      text: "Back To Event",
      action: () => {
        browserHistory.push(`/event/${Events.findOne().slug}`);
      }
    })
    return defaultItems;
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
      <TabController items={this.items()} />
    )
  }
}

export default createContainer(({params}) => {
  const { slug, bracketIndex } = params;
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
}, BracketAdminScreen);
