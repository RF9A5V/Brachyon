import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import { browserHistory } from "react-router";
import { VelocityComponent } from "velocity-react";

import TicketPurchaseWrapper from "../ticket_purchase_wrapper.jsx";

import { Banners } from "/imports/api/event/banners.js";
import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

export default class EventTitlePage extends Component {

  constructor() {
    super();
    this.state = {
      pageIndex: 0,
      isAnimating: false,
      scrollAmount: 0
    }
  }

  imgOrDefault(img) {
    return img == null ? "/images/profile.png" : img;
  }

  render() {
    var event = Events.findOne();
    var tickets = false;
    var brackets = Instances.findOne().brackets;
    return (
      <div className="row">
        <div className="col-1">
        </div>
        <div className="col col-3 center x-center">
          <div className="col center x-center col-2">
            <h2 className="sponsor-event-header">{event.details.name}</h2>
            <div className="row">
              {
                brackets && !tickets && !event.isComplete ? (
                  brackets.some((bracket) => {
                    return (bracket.participants || []).some((player) => {
                      return player.id == Meteor.userId()
                    })
                  }) || brackets.every(bracket => {
                    return bracket.isComplete;
                  }) ? (
                    <button style={{marginRight: event.stream ? 10 : 0, width: 140}} onClick={() => { browserHistory.push(`/event/${event.slug}/bracket/0`) }}>
                      View Bracket
                    </button>
                  ) : (
                    <button style={{marginRight: event.stream ? 10 : 0, width: 140}} onClick={() => {
                      this.props.pages("Brackets")
                    }}>
                      Register
                    </button>
                  )
                ) : (
                  ""
                )
              }
              {
                event.stream ? (
                  <button style={{width: 140}} onClick={() => { this.props.pages("Stream") }}>Watch</button>
                ) : (
                  ""
                )
              }
            </div>
          </div>
        </div>
        <div className="col col-1">
          <div className="col" style={{backgroundColor: "#111", padding: 20, margin: 20}}>
            <div className="row x-center" style={{marginBottom: 20}}>
              <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                <FontAwesome name="calendar" size="2x" />
              </div>
              <span>
                {moment(event.details.datetime).format("MMM Do, YYYY @ h:mmA")}
              </span>
            </div>
            {
              event.details.location.online ? (
                <div className="row x-center">
                  <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                    <FontAwesome name="signal" size="2x" />
                  </div>
                  <span>
                    Online
                  </span>
                </div>
              ) : (
                <div className="row x-center">
                  <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                    <FontAwesome name="map-marker" size="2x" />
                  </div>
                  <div className="col">
                    <span>
                      {
                        event.details.location.locationName ? event.details.location.locationName : event.details.location.streetAddress
                      }
                    </span>
                    <span>
                      {
                        event.details.location.city + ", " + event.details.location.state
                      }
                    </span>
                  </div>
                </div>
              )
            }


          </div>
        </div>
      </div>
    )
  }
}
