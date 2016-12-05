import React, { Component } from "react";
import { browserHistory } from "react-router";
import FontAwesome from "react-fontawesome";
import { Session } from 'meteor/session'

import Games from "/imports/api/games/games.js";
import Notifications from "/imports/api/users/notifications.js";

import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

export default class BracketSlide extends Component {

  constructor(props) {
    super(props);
    var event = this.props.event;
    this.state = {
      id: event._id
    }
  }

  backgroundImage(useDarkerOverlay){
    var imgUrl = "/images/bg.jpg";
    if(this.props.event && this.props.event.details.banner) {
      imgUrl = Banners.findOne(this.props.event.details.banner).link();
    }
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  onInviteAccept(note) {
    Meteor.call("users.notifications.acceptInvitation", note._id, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully joined event!", "Success");
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
      }
    })
  }

  bracketButton(bracket, i) {
    var instance = Instances.findOne();
    var isRegistered = bracket.participants && bracket.participants.some((obj, j) => { return obj.id == Meteor.userId() });
    var note = Notifications.findOne({ eventSlug: this.props.event.slug, recipient: Meteor.userId(), type: "eventInvite" });
    if(note) {
      return [
        (
          <div className="bracket-register-button" onClick={() => { this.onInviteAccept(note) }}>
            <FontAwesome name="check" />
          </div>
        ),
        (
          <div className="bracket-register-button" onClick={() => { this.onInviteReject(note) }}>
            <FontAwesome name="times" />
          </div>
        )
      ]
    }
    if(isRegistered) {
      var f = (e) => {
        e.preventDefault();
        e.stopPropagation();
        Meteor.call("events.removeParticipant", this.state.id, i, Meteor.userId(), (err) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
          else {
            return toastr.success("Successfully unregistered for bracket!", "Success!");
          }
        })
      };
      return (
        <div className="bracket-register-button" onClick={f}>
          <FontAwesome name="times" />
        </div>
      )
    }
    var f = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if(instance.tickets) {
        Session.set({
          use: "tickets",
          tickets: ["venue", `${i}`]
        })
        browserHistory.push(`/events/${this.props.event.slug}/checkout`);
      }
      else {
        Meteor.call("events.registerUser", this.state.id, i, (err) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
          else {
            return toastr.success("Successfully registered for bracket!", "Success!");
          }
        })
      }
    };
    return (
      <div className="bracket-register-button" onClick={f}>
        <FontAwesome name="sign-in" />
      </div>
    )
  }

  render() {
    var instance = Instances.findOne(this.props.event.instances[this.props.event.instances.length - 1]);
    return (
      <div className="slide-page-container">
        <div className="slide-page col x-center center" style={{backgroundImage: this.backgroundImage(true)}}>
          <div className="row" style={{flexWrap: "wrap", width: "90%"}}>
            {
              instance.brackets.map((bracket, i) => {
                return (
                  <div className="bracket">
                    <img style={{width: "100%", height: "auto"}} src={GameBanners.findOne(Games.findOne(bracket.game).banner).link()} />
                    <div className="bracket-overlay">
                      <div className="row" style={{justifyContent: "flex-end"}}>
                        { this.bracketButton(bracket, i) }
                      </div>
                      <div className="bracket-details">
                        {
                          // <div className="bracket-detail-row">
                          //   <div className="bracket-detail-item">
                          //     <FontAwesome name="gamepad" />
                          //   </div>
                          //   <div className="bracket-detail-item">
                          //     <span>{ Games.findOne(bracket.game).name }</span>
                          //   </div>
                          // </div>
                        }
                        <div className="bracket-detail-row">
                          <div className="bracket-detail-item">
                            <FontAwesome name="user" />
                          </div>
                          <div className="bracket-detail-item">
                            <span>{ 0 }</span>
                          </div>
                        </div>
                        <div className="bracket-detail-row">
                          <div className="bracket-detail-item">
                            <FontAwesome name="trophy" />
                          </div>
                          <div className="bracket-detail-item">
                            <span>${0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="bracket-view-button" onClick={() => {
                        if(this.props.event.owner == Meteor.userId()) {
                          browserHistory.push(`/events/${this.props.event.slug}/brackets/${i}/admin`)
                        }
                        else {
                          browserHistory.push(`/events/${this.props.event.slug}/brackets/${i}`);
                        }
                      }}>
                        <FontAwesome name="eye" />
                      </div>
                    </div>
                    {
                      // <div className="col center x-center" style={{position: "absolute", width: "100%", height: "100%", top: 0}}>
                      //   <div className="col-1 col center x-center">
                      //     <span style={{fontSize: 12, backgroundColor: "rgba(0, 0, 0, 0.8)", padding: 5, marginTop: 55}}>
                      //       Click <a href="#" onClick={(e) => { e.preventDefault() }}>here</a> to view the bracket!
                      //     </span>
                      //   </div>
                      //   <div className="bracket-button">
                      //     {
                      //       this.bracketButton(bracket, i)
                      //     }
                      //   </div>
                      // </div>
                    }
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }
}
