import React, { Component } from "react";
import { browserHistory } from "react-router";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import ApproveEventAction from "./approve_events.jsx";
import AddGameAction from "./add_game.jsx";
import RemoveEventAction from "./remove_events.jsx";
import TagAction from "./tags.jsx";
import ApproveGameAction from "./approve_game.jsx";
import Promo from "./promo.jsx";

import LoadingScreen from "../public/loading.jsx";

export default class AdminFunctionMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId(), {
        onReady: () => {
          var user = Meteor.users.findOne(Meteor.userId());
          var isAdmin = user.emails.some((email) => {
            return email.address.indexOf("brachyon.com") >= 0;
          });
          if(!isAdmin) {
            browserHistory.push("/");
          }
          else {
            this.setState({isReady: true})
          }
        }
      }),
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ gamesReady: true })
        }
      }),
      isReady: false,
      gamesReady: false
    }
  }

  componentWillUnmount() {
    this.state.user.stop();
    this.state.games.stop();
  }

  items() {
    return [
      {
        text: "Unpublished",
        icon: "check",
        subitems: [
          {
            component: ApproveEventAction
          }
        ]
      },
      {
        text: "Published",
        icon: "sitemap",
        subitems: [
          {
            component: RemoveEventAction
          }
        ]
      },
      {
        text: "All Games",
        icon: "gamepad",
        subitems: [
          {
            component: AddGameAction
          }
        ]
      },
      {
        text: "Unapproved",
        icon: "gamepad",
        subitems: [
          {
            component: ApproveGameAction
          }
        ]
      },
      {
        text: "Tags",
        icon: "tags",
        subitems: [
          {
            component: TagAction
          }
        ]
      },
      {
        text: "Promo",
        icon: "usd",
        subitems: [
          {
            component: Promo
          }
        ]
      }
    ]
  }

  render() {
    if(!this.state.isReady || !this.state.gamesReady){
      return <LoadingScreen />
    }
    return (
      <TabController items={this.items()} />
    )
  }
}
