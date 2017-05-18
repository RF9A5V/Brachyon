import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ResetModal extends ResponsiveComponent {

  resetEventHandler() {
    const id = Instances.findOne()._id;
    Meteor.call("events.stop_event", id, this.props.index || 0, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onClose();
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
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose} >
        <div className="col col-1" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: `calc(${opts.fontSize} * 2)`}} onClick={this.props.onClose}/>
          </div>
          <div className="col x-center center col-1">
            <h3 style={textStyle}>DANGER</h3>
            <p style={textStyle}><br></br>This action will be irreversible. You will not be able to roll back the bracket to a previous state except through manual input. Confirm this action.</p>
            <div className="row center x-center">
              <button className={opts.buttonClass} onClick={this.props.onClose} style={{marginRight:"15px"}}>Cancel</button>
              <button className={"reset-highlight " + opts.buttonClass} onClick={this.resetEventHandler.bind(this)} style={{margin:"0"}}>Reset</button>
            </div>
          </div>
        </div>

      </Modal>
    )
  }

  renderDesktop() {
    return this.renderBase({
      buttonClass: "",
      modalClass: "",
      overlayClass: "",
      fontSize: "1em"
    })
  }

  renderMobile() {
    return this.renderBase({
      buttonClass: "large-button",
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      fontSize: "2.5em"
    })
  }

}
