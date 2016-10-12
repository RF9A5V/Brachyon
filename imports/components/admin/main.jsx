import React, { Component } from "react";
import { browserHistory } from "react-router";

import TabController from "/imports/components/public/side_tabs/tab_controller.jsx";

import ApproveEventAction from "./approve_events.jsx";
import AddGameAction from "./add_game.jsx";

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
      eventsToApprove: Meteor.subscribe("eventsUnderReview", {
        onReady: () => {
          this.setState({ isEventsReady: true })
        }
      }),
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ gamesReady: true })
        }
      }),
      isReady: false,
      isEventsReady: false,
      gamesReady: false
    }
  }

  componentWillUnmount() {
    this.state.user.stop();
  }

  items() {
    return [
      {
        text: "Events",
        icon: "check",
        subitems: [
          {
            component: ApproveEventAction
          }
        ]
      },
      {
        text: "Games",
        icon: "gamepad",
        subitems: [
          {
            component: AddGameAction
          }
        ]
      }
    ]
  }

  render() {
    console.log(this.state.user.ready());
    console.log(this.state.eventsToApprove.ready())
    if(!this.state.user.ready() || !this.state.isEventsReady || !this.state.gamesReady){
      return <LoadingScreen />
    }
    return (
      <TabController items={this.items()} />
    )
  }
}
