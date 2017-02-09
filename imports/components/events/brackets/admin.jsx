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

class BracketAdminScreen extends Component {

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
              bracket
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
    if(bracket && bracket.id) {
      defaultItems = defaultItems.concat([
        {
          text: "Bracket",
          icon: "sitemap",
          subitems: [
            {
              component: BracketAction,
              args: {
                id: bracket.id,
                eid: this.props.params.eventId,
                format: bracket.format.baseFormat,
              }
            }
          ]
        }
      ]);
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
                index: index
              }
            }
          ]
        }
      ])
    }
    return defaultItems;
  }

  render() {
    console.log(this.props);
    const { ready } = this.props;
    if(!ready) {
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
  const { slug, id } = params;
  const eventHandle = Meteor.subscribe("event", slug);
  const instanceHandle = Meteor.subscribe("bracketContainer", id);
  const ready = eventHandle.ready() && instanceHandle.ready();
  return {
    ready,
    event: Events.findOne(),
    instance: Instances.findOne(),
    bracket: Brackets.findOne()
  }
}, BracketAdminScreen);
