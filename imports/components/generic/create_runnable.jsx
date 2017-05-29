import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class CreateRunnableScreen extends ResponsiveComponent {

  constructor(props) {
    super(props);
    if(!Meteor.userId()) {
      browserHistory.push("/");
      toastr.warning("You need to be logged in for this.");
    }
    this.state = {
      initReady: true,
      ready: false
    }
  }

  renderBase(opts) {

    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.initReady} onReady={() => { this.setState({ready: true}) }} />
      )
    }

    return (
      <div className="row-to-col col-1 center x-center" style={{paddingBottom: opts.mobile ? 136 : 0}}>
        <div className="create-sel sel-quick" onClick={ () => { browserHistory.push("/brackets/create") } } style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="sitemap" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{margin: 10, fontSize: opts.headerSize}}>Quick Bracket</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left", padding: opts.textPad}}>
            Instantly generate a bracket that tracks user stats. The bracket will not be displayed in discover.
          </p>
        </div>
        <div className="create-sel sel-event" onClick={() => { browserHistory.push("/events/create") }} style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="square-o" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{color: "#00BDFF", margin: 10, fontSize: opts.headerSize}}>Event Create</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left", padding: opts.textPad}}>
            Create a discoverable event. Add brackets, streaming, crowdfunding, promotion and many other modules to your event.
          </p>
        </div>
        <div className="create-sel sel-league" onClick={() => { browserHistory.push("/leagues/create") }} style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="clone" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{color: "#FF6000", margin: 10, fontSize: opts.headerSize}}>League Create</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left", padding: opts.textPad}}>
            Create a series of discoverable events, tracking competitor scores from event to event. The competitor with the most points at the end of the league becomes grand champion.
          </p>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      headerSize: "1em",
      pSize: "1em",
      blockSize: 270,
      iconSize: "5.5rem",
      mobile: false,
      textPad: 0
    });
  }

  renderMobile() {
    return this.renderBase({
      headerSize: "1em",
      pSize: "1em",
      blockSize: "80vw",
      iconSize: "5.5rem",
      mobile: true,
      textPad: 0
    });
  }

}
