import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import LeaderboardPanel from "../show/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";
import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import Brackets from "/imports/api/brackets/brackets.js"

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

export default class BracketShowScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", this.props.params.slug, {
        onReady: () => {
          this.setState({
            bracket: Meteor.subscribe("brackets", Instances.findOne().brackets[this.props.params.bracketIndex].id, {
              onReady: () => {
                this.setState({
                  ready: true
                })
              }
            })
          })
        }
      })
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
                format: instance.brackets[this.props.params.bracketIndex].format.baseFormat,
                rounds: Brackets.findOne(bracket._id)
              }
            }
          ]
        }
      ])
    }
    if(!bracket.endedAt) {
      defaultItems.push({
        text: "Participants",
        icon: "users",
        subitems: [
          {
            component: ParticipantList,
            args: {
              participants: instance.brackets[this.props.params.bracketIndex].participants || [],
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
    return defaultItems;
  }

  render() {
    if(this.state.ready) {
      return (
        <TabController items={this.items()} />
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
