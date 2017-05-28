import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Title extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      title: props.title || "",
      season: props.season || ""
    }
  }

  value() {
    return {
      title: this.refs.title.value,
      season: this.refs.season.value
    }
  }

  onChange(e, field) {
    var { value } = e.target;
    if(value.length > 50) {
      value = value.slice(0, 50);
    }
    this.state[field] = value;
    this.forceUpdate();
  }

  renderBase(opts) {
    return (
      <div className={opts.orientation}>
        <div className="col col-1" style={{marginRight: opts.orientation == "row" ? 10 : 0}}>
          <label style={{fontSize: opts.fontSize}} className="input-label">Title { this.state.title.length } / 50</label>
          <input className={opts.inputClass} type="text" ref="title" onChange={(e) => {
            this.onChange(e, "title")
          }} value={this.state.title} style={{marginTop: 0, marginRight: 0, marginBottom: 0}} />
        </div>
        <div className="col col-1">
          <label className="input-label" style={{fontSize: opts.fontSize}}>Season { this.state.season.length } / 50</label>
          <input className={opts.inputClass} type="text" ref="season" onChange={(e) => {
            this.onChange(e, "season")
          }} value={this.state.season} style={{marginTop: 0, marginRight: 0, marginBottom: 0}} />
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      orientation: "row",
      fontSize: "1em",
      inputClass: ""
    })
  }

  renderMobile() {
    return this.renderBase({
      orientation: "col",
      fontSize: "2.5em",
      inputClass: "large-input"
    })
  }
}
