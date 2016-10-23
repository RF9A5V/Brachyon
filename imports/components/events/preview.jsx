import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import GoogleMapsLoader from "google-maps";
import moment from "moment";
import { browserHistory } from "react-router";

import SlideMain from "./preview/slides/slide_main.jsx";

import TitlePage from "./preview/slides/title.jsx";
import CFPage from "./preview/slides/crowdfunding.jsx";
import StreamPage from "./preview/slides/stream.jsx";

import TicketPurchaseWrapper from "./preview/ticket_purchase_wrapper.jsx";

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", this.props.params.eventId, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      users: Meteor.subscribe("event_participants", this.props.params.eventId, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      sponsors: Meteor.subscribe("event_sponsors", this.props.params.eventId, {
        onReady: () => {
          this.setState({
            isReady: this.state.event.ready() && this.state.users.ready() && this.state.sponsors.ready()
          })
        }
      }),
      isReady: false,
      anim: false
    })
  }

  componentWillUnmount(){
    this.state.event.stop();
    this.state.users.stop();
    this.state.sponsors.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  slides() {
    var event = this.event();
    var pages = [
      {
        name: "Home",
        component: <TitlePage event={event} />
      }
  ];
    if(event.crowdfunding) {
      pages.push({
        name: "Crowdfunding",
        component: <CFPage event={event} />
      });
    }
    if(event.twitchStream){
      pages.push({
        name: "Streams",
        component: <StreamPage event={event} />
      })
    }
    return pages
  }

  render() {
    if(!this.state.isReady){
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
