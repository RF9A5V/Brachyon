import React, { Component } from "react"
import TrackerReact from "meteor/ultimatejs:tracker-react"
import GoogleMapsLoader from "google-maps";

import SideTabs from "../public/side_tabs.jsx";
import DetailsPanel from "./preview/details.jsx";
import BracketsPanel from "./preview/brackets.jsx";
import CrowdfundingPanel from "./preview/crowdfunding.jsx";
import TicketsPanel from "./preview/tickets.jsx";

import moment from "moment";

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    var self = this;
    this.setState({
      event: Meteor.subscribe("event", this.props.params.eventId, {
        onReady() {
          self.setState({
            loaded: true
          })
        }
      }),
      loaded: false
    })
  }

  componentWillUnmount(){
    this.state.event.stop();
  }

  event() {
    return Events.find().fetch()[0];
  }

  imgOrDefault() {
    var event = this.event();
    if(event.banner == null){
      return "/images/bg.jpg";
    }
    else {
      return event.banner;
    }
  }

  items() {
    return ["Details", "Brackets", "Crowdfunding", "Tickets"];
  }

  content() {
    var event = this.event();
    return [
      (<DetailsPanel {...event.details} ref="details"/>),
      (<BracketsPanel />),
      (<CrowdfundingPanel tiers={event.revenue.tiers} goals={event.revenue.goals} id={event._id} contributed={event.sponsors[Meteor.userId()]} ref="cf" />),
      (<TicketsPanel tickets={event.revenue.tickets} owner={event.owner} ref="tickets" />)
    ]
  }

  render() {
    var event = this.event();
    if(!this.state.loaded){
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div className="box col" style={{flexFlow: "row"}}>
        <SideTabs items={this.items()} panels={this.content()} />
        <div style={{width: "20%"}}>
          <div className="col location-container">
            <img src={this.imgOrDefault()} style={{width: "100%", height: "auto", marginBottom: 20}} />
            <span className="event-title">{ event.details.name || "Set Event Name" }</span>
            <div className="col" style={{marginBottom: 20}}>
            {
              event.details.location.online ? (
                "Online"
              ) : (
                <div>
                  {event.details.location.locationName ? (
                    <span>{event.details.location.locationName}</span>
                  ) : ( "" )}
                  <span>{event.details.location.streetAddress}</span>
                  <span>{event.details.location.city} {event.details.location.state}</span>
                </div>
              )
            }
            </div>
            <b style={{textAlign: "center", marginBottom: 10}}>{moment(event.details.datetime).format("MMMM Do YYYY")}</b>
            {
              event.published ? (
                <div className="row center">
                  <button>Register!</button>
                </div>
              ) : (
                ""
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
