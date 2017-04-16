import React, { Component } from 'react'
import WinnersBracket from "./winners.jsx";
import LosersBracket from "./losers.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DoubleDisplay extends ResponsiveComponent {

  constructor(props) {
    super(props);
    console.log("hi there")
    this.state = {};
  }

  renderBase(opts) {
    console.log('whyyyyy')
    return (
      <div id="double" className="col">
        <WinnersBracket {...this.props} />
        <LosersBracket {...this.props} />
        <div className="row" style={{top: opts.top, right: opts.right, position: "fixed"}}>
          <button className={opts.buttonClass} style={{marginRight: 20}}>Winners</button>
          <button className={opts.buttonClass}>Losers</button>
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      top: 70,
      right: 20,
      buttonClass: ""
    });
  }

  renderMobile() {
    return this.renderBase({
      top: 156,
      right: 30,
      buttonClass: "large-button"
    });
  }

}
