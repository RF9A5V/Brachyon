import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import { browserHistory } from "react-router";

import Organizations from "/imports/api/organizations/organizations.js";

import { Banners } from "/imports/api/event/banners.js";

export default class PreviewEventScreen extends TrackerReact(Component) {

  constructor(props) {
    super(props)

    this.state = {
      organization: Meteor.subscribe("userOwnedOrganization", Meteor.userId(), {
        onReady: () => {
          this.setState({
            isReady: this.state.organization.ready()
          })
        },
        isReady: false,
        hasLoaded: false
      })
    }
  }

  render() {
    return (
      <div>{this.state.isReady}</div>
    )
  }
}
