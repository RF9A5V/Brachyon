import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ShareOverlay extends ResponsiveComponent {

  renderDesktop() {
    return this.renderBase({
      modalClass: "tiny-modal",
      overlayClass: "",
      inputClass: "",
      iconSize: "2em"
    })
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      inputClass: "large-input",
      iconSize: "7em"
    })
  }

  renderBase(opts) {
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: opts.iconSize}} onClick={this.props.onClose} />
          </div>
          <div className="col col-1 center x-center">
            <input type="text" className={opts.inputClass} value={window.location.origin + "/!" + this.props.url} style={{margin: 0, textAlign: "center"}} onFocus={(e) => {
              e.target.select();
            }} />
          </div>
        </div>
      </Modal>
    )
  }
}
