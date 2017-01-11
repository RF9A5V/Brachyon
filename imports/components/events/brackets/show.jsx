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
    if(this.props.params.slug) {
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
        }),
        ready: false
      }
    }
    else {
      this.state = {
        bracket: Meteor.subscribe("bracketContainer", this.props.params.id, {
          onReady: () => { this.setState({ ready: true }) }
        }),
        ready: false
      }
    }

  }

  componentWillUnmount() {
    if(this.state.event) {
      this.state.event.stop();
    }
    if(this.state.bracket) {
      this.state.bracket.stop();
    }
  }

  items() {
    var instance = Instances.findOne();
    var bracket = Brackets.findOne() || {};
    var defaultItems = [];
    var id = instance.brackets[this.props.params.bracketIndex || 0].id
    if(id) {
      defaultItems = defaultItems.concat([
        {
          text: "Bracket",
          icon: "sitemap",
          subitems: [
            {
              component: BracketPanel,
              args: {
                id: id,
                format: instance.brackets[this.props.params.bracketIndex || 0].format.baseFormat
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
    return defaultItems;
  }

  render() {
    if(this.state.ready) {
      return (
        <TabController items={this.items()} />
      );
    }
    else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}
