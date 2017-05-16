import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import UserProfilePanel from "./options/profile.jsx";
import UserDetailsPanel from "./options/user_details.jsx";
import EventOptionsPanel from "./options/event_options.jsx";
import GameOptionsPanel from "./options/games_played.jsx";
import OAuthOptionsPanel from "./options/oauth.jsx";

import UserAccountPanel from "./options/account.jsx";

import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class UserOptionsScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId()),
      ready: false
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

  detailsItem() {
    return {
      name: "Details",
      icon: "file-text",
      key: "details",
      subItems: [
        {
          content: UserProfilePanel,
          name: "profile"
        }
      ]
    }
  }

  gamesItem() {
    return {
      name: "Games",
      icon: "gamepad",
      key: "games",
      subItems: [
        {
          content: GameOptionsPanel
        }
      ]
    }
  }

  oauthItem() {
    return {
      name: "Accounts",
      icon: "users",
      key: "accounts",
      subItems: [
        {
          content: UserAccountPanel
        }
      ]
    }
  }

  items() {
    return [
      this.detailsItem(),
      this.gamesItem(),
      this.oauthItem()
    ]
  }

  render() {
    if(!this.state.ready){
      return (
        <LoaderContainer ready={this.state.user.ready()} onReady={() => { this.setState({ready: true}) }} />
      )
    }
    return (
      <div style={{padding: 20}}>
        <CreateContainer items={this.items()} />
      </div>
    );
  }
}
