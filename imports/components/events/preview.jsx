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
    return ["Details", "Crowdfunding", "Tickets"];
  }

  content() {
    var event = this.event();
    return [
      (<DetailsPanel {...event.details} ref="details"/>),
      (<CrowdfundingPanel tiers={event.revenue.tiers} goals={event.revenue.goals} id={event._id} contributors={event.sponsors} ref="cf" />),
      (<TicketsPanel tickets={event.revenue.tickets} owner={event.owner} ref="tickets" />)
    ]
  }

  registerUser(e) {
    e.preventDefault();
    Meteor.call("events.toggle_participation", this.event()._id, Meteor.user()._id, function(err) {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      return toastr.success("Successfully added you to this event.", "Success!");
    })
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
                  <button onClick={this.registerUser.bind(this)}>Register!</button>
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
