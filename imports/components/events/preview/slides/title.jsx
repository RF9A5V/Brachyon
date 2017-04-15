import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";
import { browserHistory } from "react-router";
import { VelocityComponent } from "velocity-react";

import TicketPurchaseWrapper from "../ticket_purchase_wrapper.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import ShareOverlay from "/imports/components/public/share_overlay.jsx";

import { Banners } from "/imports/api/event/banners.js";
import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

export default class EventTitlePage extends ResponsiveComponent {

  constructor() {
    super();
    this.state = {
      shortLink: null
    }
  }

  imgOrDefault(img) {
    return img == null ? "/images/profile.png" : img;
  }

  loadShortLink() {
    if(this.state.shortLink) {
      this.setState({
        shareOpen: true
      })
    }
    else {
      Meteor.call("generateShortLink", window.location.pathname, (err, data) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          this.setState({
            shortLink: data,
            shareOpen: true
          })
        }
      });
    }
  }

  renderDesktop() {
    var event = Events.findOne();
    var tickets = false;
    var brackets = Instances.findOne().brackets;
    return (
      <div className="row">
        <div className="col col-1">
          <div className="col-1">
          </div>
          <div style={{padding: 20}}>
            <button onClick={() => {
              this.loadShortLink();
            }}>Generate Short Link</button>
          </div>
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
                        event.details.location.locationName
                      }
                    </span>
                    <span>
                      {
                        event.details.location.streetAddress
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
        <ShareOverlay open={this.state.shareOpen} onClose={() => { this.setState({ shareOpen: false }) }} url={this.state.shortLink} />
      </div>
    )
  }

  renderMobile() {
    const event = Events.findOne();
    const instance = Instances.findOne();
    return (
      <div className="col" style={{padding: 40}}>
        <div className="row col-1 flex-pad" style={{alignItems: "flex-start"}}>
          <FontAwesome name="share-alt" style={{fontSize: "7em"}} onClick={() => {
            this.loadShortLink()
          }} />
          <div className="col" style={{padding: 20, backgroundColor: "#333"}}>
            <span style={{fontSize: "3em"}}>
              {
                event.details.location.online ? (
                  "Online"
                ) : (
                  event.details.location.streetAddress
                )
              }
            </span>
            {
              event.details.location.online ? (
                null
              ) : (
                <span style={{fontSize: "3em"}}>
                  { event.details.location.city + ", " + event.details.location.state }
                </span>
              )
            }
            <span style={{fontSize: "3em"}}>
              {
                moment(event.details.datetime).format("MMMM Do, YYYY")
              }
            </span>
          </div>
        </div>
        <div className="col x-center">
          <h2 style={{fontSize: "6em"}}>{ event.details.name }</h2>
          <div className="row">
            {
              instance.brackets ? (
                <button style={{fontSize: "3em", marginRight: event.stream ? 30 : 0}} onClick={() => {
                  this.props.pages("Brackets")
                }}>View Bracket</button>
              ) : (
                null
              )
            }
            {
              event.stream ? (
                <button style={{fontSize: "3em"}} onClick={() => {
                  this.props.pages("Stream")
                }}>View Stream</button>
              ) : (
                null
              )
            }
          </div>
        </div>
        <div className="row col-1">
        </div>
        <ShareOverlay open={this.state.shareOpen} onClose={() => { this.setState({ shareOpen: false }) }} url={this.state.shortLink} />
      </div>
    )
  }

}
