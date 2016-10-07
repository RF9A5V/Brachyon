import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import ParticipantAction from "./admin_comps/participants.jsx";
import EditStaffAction from "./admin_comps/edit_staff.jsx";
import StartBracketAction from "./admin_comps/start.jsx";
import BracketAction from "../show/bracket.jsx";

export default class BracketAdminScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.eventId)
    }
  }

  items() {
    var bracket = Events.findOne().brackets[this.props.params.bracketIndex];
    var defaultItems = [
      {
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
      },
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
    ];
    if(bracket.inProgress) {
      defaultItems = defaultItems.concat([
        {
          text: bracket.name,
          icon: "sitemap",
          subitems: [
            {
              component: BracketAction,
              args: {
                id: this.props.params.eventId,
                format: bracket.format.baseFormat,
                rounds: bracket.rounds
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
