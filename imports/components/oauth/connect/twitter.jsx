import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import { connectTwitter } from "/imports/decorators/social_media.js";

export default class TwitterConnect extends Component {

  onClick(e) {
    e.preventDefault();
    connectTwitter(_ => {
      this.forceUpdate();
    });
  }

  render() {
    var user = Meteor.users.findOne();
    if(user.services.twitter == null) {
      return (
        <button onClick={this.onClick.bind(this)} >
          <FontAwesome style={{marginRight: 10}} name="twitter" />
          Connect to Twitter
        </button>
      );
    }
    else {
      return (
        <button onClick={() => {
          Meteor.call("user.unlinkTwitter", (err) => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              toastr.success("Successfully unlinked Twitter account!");
              this.forceUpdate();
            }
          })
        }}>
          Unlink Account
        </button>
      )
    }
  }
}
