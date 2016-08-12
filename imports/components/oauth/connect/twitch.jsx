import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class FacebookConnect extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.linkWithTwitch({
      requestPermissions: ["user_read", "user_blocks_read", "user_subscriptions"]
    }, function(err){
      if(err){
        console.log(err);
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Integrated with Twitch!", "Success!");
      }
    })
  }

  render() {
    if(Meteor.user().services.twitch == null) {
      return (
        <button onClick={this.onClick.bind(this)} >
          <FontAwesome style={{marginRight: 10}} name="twitch" />
          Connect to Twitch
        </button>
      );
    }
    else {
      return (
        <div>Already connected to Twitch!</div>
      )
    }
  }
}
