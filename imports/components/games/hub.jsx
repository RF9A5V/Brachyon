import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import OverviewPanel from "./hubs/overview.jsx";

import Games from "/imports/api/games/games.js";
import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class GameHubScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      game: Meteor.subscribe("gamehub", props.params.slug),
      ready: false
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
      <div className="col center x-center" style={{paddingBottom:10}}>
        <img src={game.bannerUrl} style={{width: 180, height: "auto", marginBottom: 10}} />
        <button>Subscribe</button>
      </div>
    )
  }

  render() {
    if (!this.state.ready){
      return (
        <LoaderContainer ready={this.state.game.ready()} onReady={() => { this.setState({ready: true}) }} />
      )
    }
    return(
      <div className="row">
        <div className={"tab-menu"} style={{marginRight:5}}>
          {this.componentHeader()}
        </div>
        <OverviewPanel/>
      </div>
      )
  }
}
