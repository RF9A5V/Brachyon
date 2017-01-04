import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import OverviewPanel from "/imports/components/sandbox/overview.jsx";

import Games from "/imports/api/games/games.js";

export default class Sandbox extends TrackerReact(Component) {

  constructor() {
    super();
    this.state = {
      game: Meteor.subscribe("game", "sfv"),
      ready: false
    }
  }

  items() {
    return [
      {
        text: "Overview",
        icon: "globe",
        subitems: [
          {
            component: OverviewPanel
          }
        ]
      },
      {
        text: "Wiki",
        icon: "wikipedia-w",
        subitems: [
          {
            component: OverviewPanel
          }
        ]
      }
    ]
  }

  componentHeader() {
    var game = Games.findOne();
    return (
      <div className="col center x-center" style={{padding: 10, borderBottom: "solid 2px #666", marginBottom: 10}}>
        <img src={game.bannerUrl} style={{width: 180, height: "auto", marginBottom: 10}} />
        <button>Subscribe</button>
      </div>
    )
  }

  render() {
    if(!this.state.game.ready()) {
      return (
        <div>
        </div>
      )
    }
    return (
      <TabController items={this.items()} componentHeader={this.componentHeader()} />
    )
  }
}
