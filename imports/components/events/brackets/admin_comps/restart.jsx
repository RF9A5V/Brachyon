import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import ResetModal from "./reset_modal.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class RestartAction extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  renderBase(opts) {

    const textStyle = {
      fontSize: opts.fontSize
    }
    return (
      <div>
        <p style={textStyle}>
          Warning! This will regenerate your bracket from scratch, throwing everything back to round one. This is not recommended for large events or for events that have already played well into the bracket.
        </p>
        <div className="row center">
          <button className={opts.buttonClass} onClick={() => { this.setState({ open: true }) }}> Reset </button>
        </div>
        <ResetModal open={this.state.open} onClose={() => { this.setState({ open: false }) }} onStart={this.props.onStart} index={this.props.index} />
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em"
    });
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em"
    });
  }

}
