import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class EventResult extends ResponsiveComponent {

  constructor(props) {
    super(props);
    switch(props.type) {
      case "event": this.color = "#00BDFF"; break;
      case "league": this.color = "#FF6000"; break;
      default: this.color = "#FFFFFF"; break;
    }
  }

  type() {
    switch(this.props.type) {
      case "event": return "Event";
      case "league": return "League";
      case "bracket": return "Quick Bracket";
    }
  }

  renderBase(opts) {
    return (
      <div className="row" style={{width: "100%", backgroundColor: "#111", cursor: "pointer", borderLeft: `solid 2px ${this.color}`}} onClick={() => {
        browserHistory.push("/" + this.props.type + "/" + this.props.slug)
      }}>
        <img src={this.props.bannerUrl || "/images/bg.jpg"} style={{width: "45%", height: "90%"}} />
        <div className="col col-1" style={{padding: 20, boxSizing: "border-box"}}>
          <span style={{wordWrap: "break-word", fontSize: opts.fontSize}}>{ this.props.name }</span>
          <span style={{fontSize: `calc(${opts.fontSize} * 0.75)`}}>{ this.props.date ? moment(this.props.date).format("M/D/YY h:mmA") : "" }</span>
          <span style={{fontSize: `calc(${opts.fontSize} * 0.75)`, color: this.color}}>{ this.type() }</span>
        </div>
      </div>
    )
  }
  renderDesktop() {
    return this.renderBase({
      fontSize: "1em"
    })
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em"
    })
  }

}
