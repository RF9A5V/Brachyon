import React, { Component } from "react";
import Modal from "react-modal";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class RestartAction extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  resetEventHandler() {
    var id;
    var event = Events.findOne();
    if(!event) {
      id = Instances.findOne()._id;
    }
    else {
      id = event._id;
    }
    Meteor.call("events.start_event", id, this.props.index || 0, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ open: false });
        toastr.success("Successfully reset bracket!", "Success!");
        this.props.onStart();
      }
    });
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
        <Modal className="create-modal" overlayClassName={opts.overlayClass} classname={opts.modalClass} isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }} >
          <div className="col x-center center">
            <h3 style={textStyle}>DANGER</h3>
            <p style={textStyle}><br></br>This action will be irreversible. You will not be able to roll back the bracket to a previous state except through manual input. Confirm this action.</p>
            <div style={{display:"inline-block"}}>
              <div className="inline-button">
                <button className={opts.buttonClass} onClick={() => { this.setState({open: false}) }} style={{width:"100px", marginRight:"15px"}}>Cancel</button>
              </div>
              <div className="inline-button">
                <button className={"reset-highlight " + opts.buttonClass} onClick={this.resetEventHandler.bind(this)} style={{margin:"0"}}>Reset</button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      buttonClass: "",
      modalClass: "",
      overlayClass: "overlay-class"
    });
  }

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em",
      buttonClass: "large-button",
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only"
    });
  }

}
