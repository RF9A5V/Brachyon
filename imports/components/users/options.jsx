import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SideTabs from "../public/side_tabs.jsx";
import UserDetailsPanel from "./options/user_details.jsx";
import EventOptionsPanel from "./options/event_options.jsx";
import GameOptionsPanel from "./options/games_played.jsx";
import OAuthOptionsPanel from "./options/oauth.jsx";

export default class UserOptionsScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId())
    }
  }

  componentWillUnmount() {
    this.state.user.stop();
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
        "User Details",
        "Event Options",
        "Games Played",
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
