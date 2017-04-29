import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class OptionsModal extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      tab: "Limit",
      limit: 0
    }
  }

  value() {
    if(this.state.limit > 0 && this.state.limit < 4) {
      throw new Error("Your bracket limit can't be less than 4. Set to 0 for no limit.");
    }
    return {
      limit: this.state.limit
    }
  }

  tabs(opts) {
    return (
      <div className="row">
        {
          ["Limit"].map(tab => {
            return (
              <div style={{fontSize: opts.fontSize, borderBottom: this.state.tab == tab ? "solid 2px #FF6000" : ""}} onClick={() => {
                this.setState({
                  tab
                })
              }}>
                { tab }
              </div>
            )
          })
        }
      </div>
    );
  }

  limitContent(opts) {
    return (
      <div style={{display: this.state.tab == "Limit" ? "inherit" : "none"}}>
        <p style={{fontSize: opts.fontSize}}>
          Content Goes Here!
        </p>
        <div className="col">
          <label className="input-label" style={{fontSize: opts.fontSize}}>Bracket Limit</label>
          <input type="number" style={{marginTop: 0, marginRight: 0}} onChange={(e) => {
            const limit = Math.max(parseInt(e.target.value), 0);
            this.setState({
              limit
            });
            this.props.options.limit = limit;
          }} defaultValue={this.props.options.limit || 0} />
        </div>
      </div>
    )
  }

  content(opts) {
    return (
      <div>
        {
          this.limitContent(opts)
        }
      </div>
    )
  }

  renderBase(opts) {
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row justify-end">
            <FontAwesome name="times" style={{fontSize: opts.iconSize}} onClick={() => {
              this.props.onClose();
            }} />
          </div>
          { this.tabs(opts) }
          <div className="col col-1 center x-center">
            {
              this.content(opts)
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
      iconSize: "2em",
      fontSize: "1em"
    })
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      iconSize: "5em",
      fontSize: "2.5em"
    });
  }

}
