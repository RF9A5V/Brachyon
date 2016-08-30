import React, { Component } from "react";
import TrackerReact from "meteor/ultimatejs:tracker-react"

import PaymentContainer from "../events/crowdfunding/payment_container.jsx";

export default class ProcessTestScreen extends TrackerReact(Component) {

  constructor() {
    super();
    this.state = {
      event: Meteor.subscribe("event", "x4B8oqDvJhDmejqFa")
    }
  }

  openModal() {
    this.refs.wrapper.openModal();
  }

  render() {
    if(!this.state.event.ready()) {
      return (
        <div>
        </div>
      )
    }
    return (
      <div>
        <PaymentContainer ref="wrapper" />
        <button onClick={this.openModal.bind(this)}>Open Modal</button>
      </div>
    )
  }
}
