import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SideTabs from "../public/side_tabs.jsx";
import UserDetailsPanel from "./options/details.jsx";
import EventOptionsPanel from "./options/events.jsx";
import GameOptionsPanel from "./options/games.jsx";
import OAuthOptionsPanel from "./options/oauth.jsx";

export default class UserOptionsScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId())
    }
  }

  refresh() {
    this.state.user.stop();
    this.setState({
      user: Meteor.subscribe("user", Meteor.userId())
    });
  }

  items() {
    return (
      [
        "Details",
        "Events",
        "Games",
        "Connected Accounts"
      ]
    );
  }

  panels() {
    return (
      [
        (<UserDetailsPanel refresh={this.refresh.bind(this)} />),
        (<EventOptionsPanel />),
        (<GameOptionsPanel />),
        (<OAuthOptionsPanel />)
      ]
    );
  }

  render() {
    if(!this.state.user.ready()){
      return (
        <div></div>
      );
    }
    return (
      <div className="box col">
        <SideTabs items={this.items()} panels={this.panels()} />
      </div>
    );
  }
}
