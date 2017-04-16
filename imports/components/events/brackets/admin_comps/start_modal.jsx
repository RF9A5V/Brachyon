import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class StartModal extends ResponsiveComponent {

  onBracketStart() {
    const instance = Instances.findOne();
    Meteor.call("events.start_event", instance._id, this.props.index, (e) => {
      if(e) {
        return toastr.error(e.reason);
      }
      this.props.onStart();
      this.props.onClose();
      toastr.success("Successfully started bracket!");
    })
  }

  renderBase(opts) {
    const participants = Instances.findOne().brackets[this.props.index].participants || [];
    const nonChecked = participants.filter(p => { return !p.checkedIn });
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: `calc(${opts.fontSize} * 2)`}} onClick={this.props.onClose} />
          </div>
          <div className="col col-1 center x-center">
          {
            nonChecked.length == 0 ? (
              <div className="col">
                <span style={{fontSize: opts.fontSize}}>Starting bracket with {participants.length} players!</span>
                <span style={{fontSize: opts.fontSize}}>User options from this point on will be disabled.</span>
                <div className="row center">
                  <button className={opts.buttonClass} onClick={this.onBracketStart.bind(this)}>Start</button>
                </div>
              </div>
            ) : (
              <div style={{fontSize: opts.fontSize}}>
                These participants have not checked in yet.
                {
                  nonChecked.map(p => {
                    return (
                      <div style={{fontSize: "1em"}}>
                        { p.alias }
                      </div>
                    )
                  })
                }
              </div>
            )
          }
          </div>
        </div>
      </Modal>
    )
  }

  renderDesktop() {
    return this.renderBase({
      modalClass: "",
      overlayClass: "",
      fontSize: "1em",
      buttonClass: ""
    });
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      fontSize: "2.5em",
      buttonClass: "large-button"
    });
  }
}
