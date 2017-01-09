import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Notifications from "/imports/api/users/notifications.js";

export default class NotyDropdown extends Component {


  constructor(props) {
    super(props);
    this.state = {
      notes: Meteor.subscribe("userNotifications", Meteor.userId())
    }
  }

  componentWillUnmount() {
    this.state.notes.stop();
  }

  hasUnreadNotifications() {
    return Notifications.find({ seen: false }).fetch().length > 0
  }

  onNotificationRefresh() {
    this.state.notes.stop();
    this.setState({
      notes: Meteor.subscribe("userNotifications", Meteor.userId())
    })
  }

  onInviteAccept(note) {
    Meteor.call("users.notifications.acceptInvitation", note._id, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        if(note.type == "eventInvite") {
          toastr.success("Successfully joined event!", "Success");
        }
        else if(note.type == "eventRegistrationRequest") {
          toastr.success("Successfully processed registration!", "Success!");
        }
        this.onNotificationRefresh();
      }
    })
  }

  onInviteReject(note) {
    Meteor.call("users.notifications.rejectInvitation", note._id, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.warning("Rejected invitation to event.", "Success");
        this.onNotificationRefresh();
      }
    })
  }

  notifications() {
    if(!this.state.notes.ready()) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    var objs = [];
    Notifications.find().fetch().map((note) => {
      if(note.type == "eventInvite") {
        objs.push(
          <div className="note col" onClick={() => { browserHistory.push(`/events/${note.eventSlug}/show`) }}>
            <div className="row x-center">
              <img src={note.image} style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20}} />
              <div className="col">
                <h3 style={{marginBottom: 10}}>Invitation</h3>
                <span style={{fontSize: 12, marginBottom: 10}}>{ note.owner } has sent you an invitation to join { note.event }!</span>
              </div>
            </div>
            <div className="row center">
              <button className="signup-button" style={{marginRight: 10}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onInviteAccept(note); }}>Accept</button>
              <button className="login-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onInviteReject(note); }}>Reject</button>
            </div>
          </div>
        );
      }
      else if(note.type == "eventRegistrationRequest") {
        objs.push(
          <div className="note row" onClick={() => { browserHistory.push(`/events/${note.eventSlug}/show`) }}>
            <div className="row">
              <img src={note.image} style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20}} />
            </div>
            <div className="col">
              <h3 style={{marginBottom: 10}}>Registration Request</h3>
              <span>{ note.user } would like to register for { note.event }!</span>
              <div className="row center">
                <button className="signup-button" style={{marginRight: 10}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onInviteAccept(note); }}>Accept</button>
                <button className="login-button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.onInviteReject(note); }}>Reject</button>
              </div>
            </div>
          </div>
        )
      }
      objs.push(<hr className="discover-divider" />)
    });
    objs.pop();
    if(objs.length == 0) {
      objs.push(
        <div className="note row center">
          No notifications here!
        </div>
      )
    }
    return objs;
  }

  render() {
    return (
      <div>
        <div className="row center x-center" style={{borderRadius: "100%", backgroundColor: "rgba(48, 48, 48, 0.7)", padding: 5, width: 20, height: 20}}>
          <FontAwesome name="envelope" style={{color: this.hasUnreadNotifications() ? "#FF6000" : "white"}} />
        </div>
        <div className="col" style={{position: "absolute", display: this.props.open ? "inherit" : "none"}}>
          <div className="triangle-top"></div>
          <div className="col" style={{position: "relative", right: 210, backgroundColor: "#222", padding: 10, width: 300}}>
            {
              this.notifications()
            }
          </div>
        </div>
      </div>
    )
  }
}
