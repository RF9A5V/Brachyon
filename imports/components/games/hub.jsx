import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";
import OverviewPanel from "./hubs/overview.jsx";

import Games from "/imports/api/games/games.js";

export default class GameHubScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      game: Meteor.subscribe("gamehub", props.params.slug)
    }
  }

  componentWillUnmount() {
    this.state.game.stop();
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
      }
      // {
      //   text: "Wiki",
      //   icon: "wikipedia-w",
      //   subitems: [
      //     {
      //       component: OverviewPanel
      //     }
      //   ]
      // }
    ]
  }

  componentHeader() {
    var game = Games.findOne({ slug: this.props.params.slug });
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
