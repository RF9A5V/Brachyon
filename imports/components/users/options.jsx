import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

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

    var defaultItems = [];
    
    defaultItems.push({
      text: "User Details",
      icon: "cog",
      subitems: [
        {
          component: UserDetailsPanel
          
        }
      ]
    })
    defaultItems.push({
      text: "Games Played",
      icon: "cog",
      subitems: [
        {
          component: GameOptionsPanel
          
        }
      ]
    })
    defaultItems.push({
      text: "Connected Accounts",
      icon: "cog",
      subitems: [
        {
          component: OAuthOptionsPanel
          
        }
      ]
    })

    



    return defaultItems;
    
  }

  panels() {
    return (
      [
        (<UserDetailsPanel refresh={this.refresh.bind(this)} />),
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
        <TabController items={this.items()} />
      </div>
    );
  }
}
