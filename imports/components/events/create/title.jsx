import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class Title extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      value: props.title || ""
    }
  }

  value() {
    if(this.refs.title.value.length < 3) {
      toastr.error("Event title needs to be longer than 3 characters.");
      throw new Error("Event title needs to be longer than 3 characters.");
    }
    if(this.refs.title.value.length > 50) {
      toastr.error("Event title cannot be longer than 50 characters.");
      throw new Error("Event title cannot be longer than 50 characters.");
    }
    return this.refs.title.value;
  }

  onChange(e) {
    var { value } = e.target;
    if(value.length > 50) {
      value = value.slice(0, 50);
    }
    this.setState({
      value
    });
  }

  renderBase(opts) {
    return (
      <div className="col" style={{width: opts.width}}>
        <label style={{fontSize: opts.fontSize, padding: opts.labelPad}} className="input-label">Title { this.refs.title ? this.refs.title.value.length : 0 } / 50</label>
        <input className={opts.inputClass} ref="title" value={this.state.value} type="text" onChange={this.onChange.bind(this)} style={{margin: 0}}/>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      inputClass: "",
      width: 300,
      labelPad: 5
    })
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      fontSize: "2.5em",
      inputClass: "large-input",
      width: "100%",
      labelPad: 10
    })
  }

}
