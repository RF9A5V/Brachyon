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
import Brackets from "/imports/api/brackets/brackets.js";

import Instances from "/imports/api/event/instance.js";

export default class BracketAdminScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          if(!Events.findOne()) {
            return;
          }
          if(Events.findOne().owner != Meteor.userId()) {
            toastr.warning("Can't access this page if you aren't an event organizer.", "Warning!");
            browserHistory.pop();
          }
        }
      }),
      instance: Meteor.subscribe("bracketContainer", this.props.params.id)
    }
  }

  componentWillReceiveProps(next) {
    this.state.event.stop();
    this.state.instance.stop();
    this.setState({
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          if(!Events.findOne()) {
            return;
          }
          if(Events.findOne().owner != Meteor.userId()) {
            toastr.warning("Can't access this page if you aren't an event organizer.", "Warning!");
            browserHistory.pop();
          }
        }
      }),
      instance: Meteor.subscribe("bracketContainer", this.props.params.id)
    })
  }

  componentWillUnmount() {
    this.state.event.stop();
    this.state.instance.stop();
  }

  items() {
    var instance = Instances.findOne();
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
              index: this.props.params.bracketIndex,
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
      ])
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
    if(!this.state.event.ready() || !this.state.instance.ready()) {
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
