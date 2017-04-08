import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class CreateRunnableScreen extends ResponsiveComponent {
  renderBase(opts) {
    return (
      <div className="row-to-col col-1 center x-center">
        <div className="create-sel sel-quick" onClick={ () => { browserHistory.push("/brackets/create") } } style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="sitemap" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{margin: 10, fontSize: opts.headerSize}}>Quick Bracket</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left"}}>
            Instantly generate a bracket that tracks user stats. The bracket will not be displayed in discover.
          </p>
        </div>
        <div className="create-sel sel-event" onClick={() => { browserHistory.push("/events/create") }} style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="square-o" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{color: "#00BDFF", margin: 10, fontSize: opts.headerSize}}>Event Create</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left"}}>
            Create a discoverable event. Add brackets, streaming, crowdfunding, promotion and many other modules to your event.
          </p>
        </div>
        <div className="create-sel sel-league" onClick={() => { browserHistory.push("/leagues/create") }} style={{width: opts.blockSize, height: opts.blockSize}}>
          <FontAwesome name="clone" style={{
            fontSize: opts.iconSize
          }} />
          <h5 style={{color: "#FF6000", margin: 10, fontSize: opts.headerSize}}>League Create</h5>
          <p style={{fontSize: opts.pSize, textAlign: "left"}}>
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
      iconSize: "6rem"
    });
  }

  renderMobile() {
    return this.renderBase({
      headerSize: "3em",
      pSize: "2em",
      blockSize: "50vw",
      iconSize: "8rem"
    });
  }

}
