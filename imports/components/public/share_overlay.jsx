import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import { connectFB, connectTwitter } from "/imports/decorators/social_media.js";
import { openTweet, openFB } from "/imports/decorators/open_social.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ShareOverlay extends ResponsiveComponent {

  renderDesktop() {
    return this.renderBase({
      modalClass: "",
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
      iconSize: "2em",
      fontSize: "1em"
    })
  }

  shareOnFacebook() {
    const cb = () => {
      openFB(null, window.location.href);
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
      openTweet("Check out this event!", window.location.href);
    }
    if(Meteor.user().services.twitter) {
      cb();
    }
    else {
      connectTwitter(cb)
    }
  }

  changePhone() {
    const number = this.refs.phone.value.replace(/[\(-\)]/g, "");
    if(number.length != 10) {
      return toastr.error("Number must be 9 digits long.");
    }
    Meteor.call("user.updatePhoneNumber", number, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated phone number.");
        this.forceUpdate();
      }
    })
  }

  renderBase(opts) {
    const user = Meteor.user();
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: opts.iconSize}} onClick={this.props.onClose} />
          </div>
          <div className="col col-1 center">
            {
              this.props.registerShare ? (
                [
                  <div className="col center x-center" style={{marginBottom: 10}}>
                    {
                      user && user.profile.phoneNumber ? (
                        <span>
                          We've got your number, so we'll text you on updates to the event!
                        </span>
                      ) : (
                        [
                          <p>
                            You can give us your number if you want, and we can send you notifications on the event through text! Otherwise, you're good to go!
                          </p>,
                          <div className="row">
                            <input className="col-1" style={{margin: 0, marginRight: 10}} type="text" ref="phone" placeholder="555-555-5555" ref="phone" />
                            <button onClick={this.changePhone.bind(this)}>Save</button>
                          </div>
                        ]
                      )
                    }
                  </div>,
                  <hr className="user-divider" />
                ]
              ) : (
                null
              )
            }
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
            <div className="row center x-center" style={{margin: "10px 0"}}>
              <button className={`facebook-button col-1`} style={{marginRight: 10}} onClick={this.shareOnFacebook.bind(this)}>
                <FontAwesome name="facebook" style={{marginRight: 10}} />
                Share
              </button>
              <button className={`twitter-button col-1`} onClick={this.shareOnTwitter.bind(this)}>
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
