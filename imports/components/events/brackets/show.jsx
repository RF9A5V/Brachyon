import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LeaderboardPanel from "../show/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";
import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

export default class BracketShowScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug)
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
  }

  items() {
    console.log(Events.findOne())
    var bracket = Events.findOne().brackets[this.props.params.bracketIndex];
    var defaultItems = [];
    if(!bracket.isComplete) {
      defaultItems.push({
        text: "Participants",
        icon: "users",
        subitems: [
          {
            component: ParticipantList,
            args: {
              participants: bracket.participants || [],
              rounds: bracket.rounds,
              bracketIndex: this.props.params.bracketIndex
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
            component: LeaderboardPanel,
            args: {
              participants: this.props.params.bracketIndex
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
              component: BracketPanel,
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
