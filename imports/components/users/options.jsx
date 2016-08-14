import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import SideTabs from "../public/side_tabs.jsx";
import UserDetailsPanel from "./options/user_details.jsx";
import EventOptionsPanel from "./options/event_options.jsx";
import GameOptionsPanel from "./options/games_played.jsx";
import OAuthOptionsPanel from "./options/oauth.jsx";
import DiscordServerPanel from "./options/discord.jsx";

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
        "Connected Accounts",
        "Discord Servers"
      ]
    );
  }

  panels() {
    return (
      [
        (<UserDetailsPanel refresh={this.refresh.bind(this)} />),
        (<EventOptionsPanel />),
        (<GameOptionsPanel />),
        (<OAuthOptionsPanel />),
        (<DiscordServerPanel />)
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
