import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import { browserHistory } from "react-router";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import CFPage from "./preview/slides/crowdfunding.jsx";

import TicketPurchaseWrapper from "./preview/ticket_purchase_wrapper.jsx";

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", this.props.params.eventId, {
        onReady: () => {
          var event = Events.findOne();
          if(event.owner == Meteor.userId()){
            browserHistory.push("/events/" + this.props.params.eventId + "/admin");
          }
        }
      }),
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
    var pages = [
      {
        name: "Details",
        component: <TitlePage event={event} />
      }
    ];
    if(event.revenue) {
      pages.push({
        name: "Crowdfunding",
        component: <CFPage event={event} />
      });
    }
    return pages
  }

  render() {
    if(!this.state.event.ready() || !this.state.users.ready()){
      return (
        <div>Loading...</div>
      )
    }
    var event = this.event();
    return (
      <div className="box col" style={{flexFlow: "row", position: "relative"}}>
        <SlideMain slides={this.slides()} event={event} />
      </div>
    )
  }
}
