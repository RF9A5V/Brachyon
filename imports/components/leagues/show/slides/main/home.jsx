import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import moment from "moment";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import ShareOverlay from "/imports/components/public/share_overlay.jsx";

export default class MainSlide extends ResponsiveComponent {

  // Even though the prop is called event, it's actually the league.
  // Yes, I know it's dumb but I'll put this fire out when there are like 100 less fires to deal with.

  constructor(props) {
    super(props);
    this.state = {
      shortLink: null
    };
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
    var league = Leagues.findOne();
    var event = Events.findOne({ isComplete: false }, { sort: { "details.datetime": -1 } });
    return (
      <div className="col-1 col">
        <div className="row col-1">
          <div className="col col-1">
            <div className="col-1">
            </div>
            <div style={{padding: 20}}>
              <button onClick={() => {
                this.loadShortLink()
              }}>Generate Short Link</button>
            </div>
          </div>
          <div className="col-2 row center x-center">
            <h2 className="sponsor-event-header" style={{color: "#FF6000"}}>{league.details.name}</h2>
          </div>
          <div className="col-1">
            <div className="col" style={{backgroundColor: "#111", padding: 20, margin: 20}}>
              <div className="row x-center" style={{marginBottom: 20}}>
                <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                  <FontAwesome name="calendar" size="2x" />
                </div>
                <span>
                  {
                    event ? (
                      moment(event.details.datetime).format("MMM Do, YYYY @ h:mmA")
                    ) : (
                      "League Completed!"
                    )
                  }
                </span>
              </div>
              {
                league.details.location.online ? (
                  <div className="row x-center">
                    <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                      <FontAwesome name="signal" size="2x" />
                    </div>
                    <span>
                      Online
                    </span>
                  </div>
                ) : (
                  <div className="row x-center" style={{marginBottom: 20}}>
                    <div style={{width: 50, textAlign: "center", marginRight: 10}}>
                      <FontAwesome name="map-marker" size="2x" />
                    </div>
                    <div className="col">
                      <span>
                        {
                          league.details.location.locationName ? league.details.location.locationName : league.details.location.streetAddress
                        }
                      </span>
                      <span>
                        {
                          league.details.location.city + ", " + league.details.location.state
                        }
                      </span>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <ShareOverlay open={this.state.shareOpen} onClose={() => { this.setState({ shareOpen: false }) }} url={this.state.shortLink} />
      </div>
    )
  }

  renderMobile() {
    var league = Leagues.findOne();
    var event = Events.findOne({ isComplete: false }, { sort: { "details.datetime": -1 } });
    const anyEvent = Events.findOne();
    return (
      <div className="col" style={{padding: 10}}>
        <div className="col-1 row flex-pad" style={{alignItems: "flex-start"}}>
          <FontAwesome name="share-alt" style={{fontSize: "2.5em"}} onClick={() => {
            this.loadShortLink()
          }} />
          <div className="col" style={{padding: 10, backgroundColor: "#333"}}>
            <span style={{fontSize: "1em"}}>
              {
                anyEvent.details.location.online ? (
                  "Online"
                ) : (
                  anyEvent.details.location.streetAddress
                )
              }
            </span>
            {
              anyEvent.details.location.online ? (
                null
              ) : (
                <span style={{fontSize: "1em"}}>
                  { anyEvent.details.location.city + ", " + anyEvent.details.location.state }
                </span>
              )
            }
            <span style={{fontSize: "1em"}}>
              {
                event ? (
                  moment(event.details.datetime).format("MMMM Do, YYYY")
                ) : (
                  "League Complete!"
                )
              }
            </span>
          </div>
        </div>
        <div className="col center x-center">
          <h2 style={{fontSize: "2em", color: "#FF6000"}}>{ league.details.name }</h2>
        </div>
        <div className="row col-1">
        </div>
        <ShareOverlay open={this.state.shareOpen} onClose={() => { this.setState({ shareOpen: false }) }} url={this.state.shortLink} />
      </div>
    )
  }

}
