import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ToggleBracket extends ResponsiveComponent {
  renderBase(opts) {
    if(!this.props.active) {
      return null;
    }
    return (
      <div style={{position: "fixed", top: opts.top, right: 0, padding: opts.padding, display: "inline-flex", zIndex: 2}}>
        <button onClick={() => {
          window.location.hash = "#winners";
        }} className={opts.buttonClass} style={{marginRight: opts.padding}}>Winners</button>
        <button className={opts.buttonClass} onClick={() => {
          window.location.hash = "#losers"
        }}>Losers</button>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      top: 140,
      padding: 10,
      buttonClass: ""
    });
  }

  renderMobile() {
    return this.renderBase({
      top: 180,
      padding: 20,
      buttonClass: "mid-button"
    });
  }

}
