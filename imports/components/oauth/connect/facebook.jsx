import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { connectFB } from "/imports/decorators/social_media.js";

export default class FacebookConnect extends Component {

  onClick(e) {
    e.preventDefault();
    connectFB(() => {
      this.forceUpdate();
    });
  }

  render() {
    if(Meteor.user().services.facebook == null) {
      return (
        <button onClick={this.onClick.bind(this)}>
          <FontAwesome style={{marginRight: 10}} name="facebook" />
          Connect to Facebook
        </button>
      );
    }
    else {
      return (
        <button onClick={() => {
          Meteor.call("user.unlinkFB", (err) => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              toastr.success("Unlinked account!");
              this.forceUpdate();
            }
          })
        }}>Unlink Account</button>
      )
    }
  }
}
