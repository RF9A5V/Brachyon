import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import { connectFB, connectTwitter } from "/imports/decorators/social_media.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ShareOverlay extends ResponsiveComponent {

  renderDesktop() {
    return this.renderBase({
      modalClass: "tiny-modal",
      overlayClass: "",
      inputClass: "",
      iconSize: "2em",
      fontSize: "1em",
      buttonClass: ""
    })
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      inputClass: "large-input",
      iconSize: "7em",
      fontSize: "2.5em",
      buttonClass: "large-button"
    })
  }

  shareOnFacebook() {
    const cb = () => {
      Meteor.call("users.facebook.share", Events.findOne()._id, this.props.url, {
        registration: this.props.registerShare,
        type: this.props.type
      }, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully shared on Facebook!");
        }
      })
    }
    if(Meteor.user().services.facebook) {
      cb();
    }
    else {
      connectFB(cb);
    }
  }

  shareOnTwitter() {
    const cb = () => {
      Meteor.call("users.twitter.share", Events.findOne()._id, this.props.url, {
        registration: this.props.registerShare,
        type: this.props.type
      }, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully tweeted event!");
        }
      })
    }
    if(Meteor.user().services.twitter) {
      cb();
    }
    else {
      connectTwitter(cb)
    }
  }

  renderBase(opts) {
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: opts.iconSize}} onClick={this.props.onClose} />
          </div>
          <div className="col col-1 center">
            {
              this.props.registerShare ? (
                <p>You just registered for { Events.findOne().details.name }! Share with your friends here!</p>
              ) : (
                [
                  <label className="input-label" style={{fontSize: opts.fontSize}}>Sharable Link</label>,
                  <input type="text" className={opts.inputClass} value={window.location.origin + "/_" + this.props.url} style={{margin: 0, textAlign: "center"}} onFocus={(e) => {
                    e.target.select();
                  }} />
                ]
              )
            }

            <div className="row center x-center" style={{marginTop: 10}}>
              <button className={`facebook-button col-1 ${opts.buttonClass}`} style={{marginRight: 10}} onClick={this.shareOnFacebook.bind(this)}>
                <FontAwesome name="facebook" style={{marginRight: 10}} />
                Share
              </button>
              <button className={`twitter-button col-1 ${opts.buttonClass}`} onClick={this.shareOnTwitter.bind(this)}>
                <FontAwesome name="twitter" style={{marginRight: 10}} />
                Share
              </button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
