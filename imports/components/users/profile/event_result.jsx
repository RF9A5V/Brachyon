import React, { Component } from "react";
import moment from "moment";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class EventResult extends ResponsiveComponent {

  constructor(props) {
    super(props);
  }

  renderBase(opts) {
    return (
      <div className="row" style={{width: opts.imgDim * 2.5, backgroundColor: "#111", marginRight: 20, marginBottom: 20}}>
        <img src={this.props.bannerUrl || "/images/bg.jpg"} style={{width: opts.imgDim, height: opts.imgDim * 9 / 16}} />
        <div className="col col-1" style={{padding: 20, boxSizing: "border-box"}}>
          <span style={{wordWrap: "break-word"}}>{ this.props.name }</span>
          <span style={{fontSize: 12}}>{ this.props.date ? moment(this.props.date).format("M/D/YY h:mmA") : "" }</span>
        </div>
      </div>
    )
  }
  renderDesktop() {
    return this.renderBase({
      imgDim: 150
    })
  }

  renderMobile() {
    return this.renderBase({
      imgDim: 200
    })
  }

}
