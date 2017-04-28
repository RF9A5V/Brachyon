import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react";

import CreateContainer from "/imports/components/public/create/create_container.jsx";

import UserDetailsPanel from "./options/user_details.jsx";
import EventOptionsPanel from "./options/event_options.jsx";
import GameOptionsPanel from "./options/games_played.jsx";
import OAuthOptionsPanel from "./options/oauth.jsx";

import ProfileImageSelect from "./options/details/profile_image.jsx";
import ProfileBannerSelect from "./options/details/profile_banner.jsx";
import AliasSelect from "./options/details/alias.jsx";
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
          content: ProfileImageSelect,
          name: "Image"
        },
        {
          content: ProfileBannerSelect,
          name: "Banner"
        },
        {
          content: AliasSelect,
          name: "Alias"
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
          content: OAuthOptionsPanel
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
