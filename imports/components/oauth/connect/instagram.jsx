import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { connectInsta } from "/imports/decorators/social_media.js";

export default class FacebookConnect extends Component {

  onClick(e) {
    e.preventDefault();
    connectInsta(() => {
      this.forceUpdate();
    });
  }

  render() {
    if(Meteor.user().services.instagram == null) {
      return (
        <button onClick={this.onClick.bind(this)}>
          <FontAwesome style={{marginRight: 10}} name="instagram" />
          Connect to Instagram
        </button>
      );
    }
    else {
      return (
        <button onClick={() => {
          Meteor.call("user.unlinkInsta", (err) => {
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
