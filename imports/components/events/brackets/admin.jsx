import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { browserHistory } from "react-router";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import ParticipantAction from "./admin_comps/participants.jsx";
import LeaderboardAction from "./admin_comps/leaderboard.jsx";
import EditStaffAction from "./admin_comps/edit_staff.jsx";
import StartBracketAction from "./admin_comps/start.jsx";
import BracketAction from "../show/bracket.jsx";
import LogisticsPanel from "./admin_comps/logistics.jsx";
import Brackets from "/imports/api/brackets/brackets.js"

export default class BracketAdminScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          if(Events.findOne().owner != Meteor.userId()) {
            toastr.warning("Can't access this page if you aren't an event organizer.", "Warning!");
            browserHistory.pop();
          }
        }
      })
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  items() {
    var bracket = Events.findOne().brackets[this.props.params.bracketIndex];
    var rounds = Brackets.findOne(bracket.id);
    console.log(rounds);
    var defaultItems = [];
    if(!bracket.isComplete) {
      defaultItems.push({
        text: "Participants",
        icon: "users",
        subitems: [
          {
            component: ParticipantAction,
            args: {
              index: this.props.params.bracketIndex
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
              index: this.props.params.bracketIndex
            }
          }
        ]
      })
    }
    if(bracket.inProgress) {
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
                rounds: rounds
              }
            }
          ]
        },
        {
          text: "Logistics",
          icon: "edit",
          subitems: [
            {
              component: LogisticsPanel,
              args: {
                index: this.props.params.bracketIndex
              }
            }
          ]
        }
      ])
    }
    else if(!bracket.inProgress && !bracket.isComplete) {
      defaultItems = defaultItems.concat([
        {
          text: "Start",
          icon: "sign-in",
          subitems: [
            {
              component: StartBracketAction,
              args: {
                index: this.props.params.bracketIndex
              }
            }
          ]
        }
      ])
    }
    return defaultItems;
  }

  render() {
    if(!this.state.event.ready()) {
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
