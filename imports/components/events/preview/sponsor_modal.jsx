import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import { connectFB, connectTwitter } from "/imports/decorators/social_media.js";

export default class SponsorModal extends Component {

  constructor(props) {
    super(props);
    this.event = Events.findOne();
    this.link = window.location.origin + "/event/" + this.event.slug;
    this.state = {
      open: false,
      tweet: `Check out ${this.event.details.name} @ ${this.link}`
    }
  }

  open() {
    this.setState({
      open: true
    });
  }

  close() {
    this.setState({
      open: false,
      showMobileVerification: false
    })
  }

  onTweetChange(e) {
    var length = e.target.value.length;
    if(length > 140) {
      e.target.value = e.target.value.slice(0, 140);
    }
    this.setState({
      tweet: e.target.value
    });
  }

  shareToTwitter() {
    const user = Meteor.user();
    if(this.state.tweet.indexOf(this.link) < 0) {
      if(this.state.tweet.length + this.link.length > 140) {
        this.state.tweet = this.state.tweet.slice(0, 140 - this.link.length - 4) + "... " + this.link;
      }
    }
    var cb = () => {
      Meteor.call("user.shareViaTwitter", this.state.tweet, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          Meteor.call("events.addCFSponsor", this.event._id, (err) => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              toastr.success("Successfully posted to Twitter!");
              this.close();
            }
          })
        }
      })
    }
    if(!user.services.twitter) {
      connectTwitter(cb);
    }
    else {
      cb();
    }
  }

  shareToFacebook() {
    const user = Meteor.user();
    if(this.refs.facebookInput.value.indexOf(this.link) < 0) {
      return toastr.error("Please include the link for this event as part of your post.");
    }
    var cb = () => {
      Meteor.call("user.shareViaFacebook", this.refs.facebookInput.value, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          Meteor.call("events.addCFSponsor", this.event._id, (err) => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              toastr.success("Successfully posted to Facebook!");
              this.close();
            }
          })
        }
      })
    }
    if(!user.services.facebook) {
      connectFB(cb);
    }
    else {
      cb();
    }
  }

  addLinkToFacebookPost() {
    // This exists because of FB Platform policy.
    // Dumb but necessary.
    if(this.refs.facebookInput.value.indexOf(this.link) < 0) {
      this.refs.facebookInput.value += " " + this.link;
    }
  }

  saveNumber() {
    const num = this.refs.phoneNumber.value.replace(/[^0-9]/g, "");
    Meteor.call("user.updatePhoneNumber", num, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        this.setState({
          showMobileVerification: true
        })
      }
    })
  }

  validateNumber() {
    const value = this.refs.verification.value;
    Meteor.call("user.validateNumber", value, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        Meteor.call("events.addCFSponsor", this.event._id, (err) => {
          if(err) {
            toastr.error(err.reason);
          }
          else {
            toastr.success("Successfully validated phone number.");
            this.close();
          }
        })
      }
    })
  }

  renderValidationForMobile() {
    return (
      <div className="col">
        <div className="row" style={{justifyContent: "flex-end", marginBottom: 10}}>
          <FontAwesome name="times" size="2x" onClick={this.close.bind(this)} />
        </div>
        <label className="input-label">
          Verification Code
        </label>
        <input type="text" ref="verification" placeholder="Your verification code." style={{margin: 0}} />
        <div className="row" style={{marginTop: 10}}>
          <button className="col-1" onClick={this.validateNumber.bind(this)}>
            Validate
          </button>
        </div>
      </div>
    )
  }

  renderMain() {
    const user = Meteor.user();
    return (
      <div className="col">
        <div className="row" style={{justifyContent: "flex-end", marginBottom: 10}}>
          <FontAwesome name="times" size="2x" onClick={this.close.bind(this)} />
        </div>
        <div className="col col-1">
          <label className="input-label">Tweet Content { this.state.tweet.length } / 140</label>
          <textarea ref="twitterInput" style={{margin: 0, marginBottom: 10}} placeholder="Share this on Twitter" value={this.state.tweet} onChange={this.onTweetChange.bind(this)}>
            Check out {this.event.details.name} @ { this.link }
          </textarea>
          <div className="row center x-center">
            <button className="col-1" onClick={this.shareToTwitter.bind(this)}>
              <FontAwesome name="twitter" style={{marginRight: 10}} />
              <span>Share on Twitter</span>
            </button>
          </div>
          <hr className="user-divider" />
          <label className="input-label">Facebook Content</label>
          <textarea ref="facebookInput" style={{margin: 0, marginBottom: 10}} placeholder="Share this on Facebook"></textarea>
          <div className="row center x-center">
            <button className="col-1" style={{marginRight: 10}} onClick={this.addLinkToFacebookPost.bind(this)}>
              <FontAwesome name="link" style={{marginRight: 10}} />
              <span>Add Link</span>
            </button>
            <button className="col-1" onClick={this.shareToFacebook.bind(this)}>
              <FontAwesome name="facebook" style={{marginRight: 10}} />
              <span>Share on Facebook</span>
            </button>
          </div>
          {
            user && user.profile.phoneNumber && user.profile.phoneVerified ? (
              null
            ) : (
              [
                <hr className="user-divider" />,
                <div className="col" style={{marginBottom: 10}}>
                  <label className="input-label">Phone Number</label>
                  <input type="text" style={{margin: 0}} placeholder="(555) 555-5555" ref="phoneNumber" defaultValue={user.profile.phoneNumber ? user.profile.phoneNumber.slice(2) : ""} />
                </div>,
                <div className="row center x-center">
                  {
                    user.profile.phoneNumber ? (
                      <button className="col-1" style={{marginRight: 10}} onClick={() => {
                        this.setState({
                          showMobileVerification: true
                        })
                      }}>Verify</button>
                    ) : (
                      null
                    )
                  }
                  <button className="col-1" onClick={this.saveNumber.bind(this)}>
                    <FontAwesome name="mobile" style={{marginRight: 10}} />
                    <span>{user.profile.phoneNumber ? "Update Phone Number" : "Save Phone Number"}</span>
                  </button>
                </div>
              ]
            )
          }
        </div>
      </div>
    )
  }

  render() {
    const user = Meteor.user();
    return (
      <Modal isOpen={this.state.open} onRequestClose={this.close.bind(this)}>
        {
          this.state.showMobileVerification ? (
            this.renderValidationForMobile()
          ) : (
            this.renderMain()
          )
        }
      </Modal>
    )
  }
}
