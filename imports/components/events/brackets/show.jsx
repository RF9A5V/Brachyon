import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LeaderboardPanel from "../show/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";
import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import Brackets from "/imports/api/brackets/brackets.js"

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

export default class BracketShowScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          if(Instances.findOne()) {
            var bracketID = Instances.findOne().brackets[this.props.params.bracketIndex].id;
          }
        }
      }),
      instance: Meteor.subscribe("bracketContainer", this.props.params.id),
      ready: false
    }
  }

  componentWillUnmount() {
    this.state.event.stop();
    if(this.state.bracket) {
      this.state.bracket.stop();
    }
  }

  items() {
    var instance = Instances.findOne();
    var bracket = Brackets.findOne() || {};
    var defaultItems = [];
    if(!bracket.endedAt) {
      defaultItems.push({
        text: "Participants",
        icon: "users",
        subitems: [
          {
            component: ParticipantList,
            args: {
              participants: Instances.findOne().brackets[this.props.params.bracketIndex || 0].participants || [],
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
    if(bracket._id) {
      defaultItems = defaultItems.concat([
        {
          text: "Bracket",
          icon: "sitemap",
          subitems: [
            {
              component: BracketPanel,
              args: {
                id: bracket._id,
                format: Brackets.findOne().format.baseFormat,
                rounds: Brackets.findOne(bracket._id)
              }
            }
          ]
        }
      ])
    }
    return defaultItems;
  }

  render() {
    if(this.state.ready) {
      return (
        <TabController items={this.items()} />
      );
    }
    if(this.state.event.ready()) {
      var bracketID = Instances.findOne().brackets[this.props.params.bracketIndex || 0].id;
      var bracket = Meteor.subscribe("brackets", bracketID, {
        onReady: () => {
          this.setState({ ready: true, bracket });
        }
      });
      return (
        <div>
          Loading...
        </div>
      );
    }
    else if(!this.state.ready) {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}
