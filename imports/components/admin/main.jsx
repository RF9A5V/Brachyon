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
      eventsToApprove: Meteor.subscribe("eventsUnderReview"),
      isReady: false
    }
  }

  componentWillUnmount() {
    this.state.user.stop();
  }

  items() {
    return [
      {
        text: "Approve Events",
        icon: "check",
        subitems: [
          {
            component: ApproveEventAction
          }
        ]
      },
      {
        text: "Submit Game",
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
    if(!this.state.isReady || !this.state.eventsToApprove.ready()){
      return <LoadingScreen />
    }
    return (
      <TabController items={this.items()} />
    )
  }
}
