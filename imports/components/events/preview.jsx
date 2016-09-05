import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import GoogleMapsLoader from "google-maps";

// import SideTabs from "../public/side_tabs.jsx";
// import DetailsPanel from "./preview/details.jsx";
// import BracketsPanel from "./preview/brackets.jsx";
// import CrowdfundingPanel from "./preview/crowdfunding.jsx";
// import TicketsPanel from "./preview/tickets.jsx";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import CFPage from "./preview/slides/crowdfunding.jsx";

import moment from "moment";

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", this.props.params.eventId),
      users: Meteor.subscribe("event_participants", this.props.params.eventId)
    })
  }

  componentWillUnmount(){
    this.state.event.stop();
    this.state.users.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  slides() {
    var event = this.event();
    return [
      {
        name: "Details",
        component: <TitlePage event={event} />
      },
      {
        name: "Crowdfunding",
        component: <CFPage event={event} />
      }
    ]
  }

  render() {
    if(!this.state.event.ready() || !this.state.users.ready()){
      return (
        <div>Loading...</div>
      )
    }
    var event = this.event();
    return (
      <div className="box col" style={{flexFlow: "row"}}>
        <SlideMain slides={this.slides()} event={event} />
      </div>
    )
  }
}
