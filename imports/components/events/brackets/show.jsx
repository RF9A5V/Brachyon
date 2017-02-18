import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";
import { createContainer } from "meteor/react-meteor-data"

import LeaderboardPanel from "./admin_comps/leaderboard.jsx";
import BracketPanel from "../show/bracket.jsx";
import ParticipantList from "../show/participant_list.jsx";
import OptionsPanel from "./options.jsx";
import MatchList from "./show/matches.jsx";

import { formatter } from "/imports/decorators/formatter.js";
import { generateMetaTags, resetMetaTags } from "/imports/decorators/meta_tags.js";

import Brackets from "/imports/api/brackets/brackets.js"
import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import OrganizeSuite from "/imports/decorators/organize.js";

class BracketShowScreen extends Component {

  componentWillReceiveProps() {
    this.populateMetaTags();
  }

  componentWillUnmount() {
    if(this.state.event) {
      this.state.event.stop();
    }
    if(this.state.bracket) {
      this.state.bracket.stop();
    }
    resetMetaTags();
  }

  imgOrDefault() {
    var event = Events.findOne();
    if(event && event.details.bannerUrl) {
      return event.details.bannerUrl;
    }
    return "/images/brachyon_logo.png";
  }

  populateMetaTags() {
    var event = Events.findOne();
    var bracket = Instances.findOne().brackets[this.props.params.bracketIndex];

    var title = event.details.name + (bracket.name ? ` - ${bracket.name}` : "");
    var format = formatter(bracket.format.baseFormat);
    var img = this.imgOrDefault();
    var url = window.location.href;

    generateMetaTags(title, format, img, url);

    this.setState({
      hasLoaded: true
    })
  }

  items() {
    var instance = Instances.findOne();
    var bracket = Brackets.findOne() || {};
    var bracketMeta = instance.brackets[this.props.params.bracketIndex || 0];
    var defaultItems = [];
    var id = bracketMeta.id;
    var rounds;
    if(!id) {
      switch(bracketMeta.format.baseFormat) {
        case "single_elim": rounds = OrganizeSuite.singleElim(bracketMeta.participants); break;
        case "double_elim": rounds = OrganizeSuite.doubleElim(bracketMeta.participants); break;
        default: break;
      }
      rounds = rounds.map(b => {
        return b.map(r => {
          return r.map(m => {
            return {
              players: [
                m.playerOne,
                m.playerTwo
              ],
              winner: null
            }
          })
        })
      });
    }
    defaultItems.push({
      text: "Bracket",
      icon: "sitemap",
      subitems: [
        {
          component: BracketPanel,
          args: {
            id: id,
            format: instance.brackets[this.props.params.bracketIndex || 0].format.baseFormat,
            rounds: bracket.rounds || rounds || []
          }
        }
      ]
    });
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
      });
    }
    if(bracket.complete) {
      defaultItems.push({
        text: "Leaderboard",
        icon: "trophy",
        subitems: [
          {
            component: LeaderboardPanel,
            args: {
              id: Brackets.findOne()._id,
              index: this.props.params.bracketIndex
            }
          }
        ]
      })
    }
    var bracketId = Instances.findOne().brackets[this.props.params.bracketIndex || 0].id;
    if(bracketId) {
      defaultItems.push({
        text: "Matches",
        icon: "cubes",
        subitems: [
          {
            component: MatchList,
            id: bracketId
          }
        ]
      });
    }
    return defaultItems;
  }

  render() {
    if(this.props.ready) {
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
}, BracketShowScreen);
