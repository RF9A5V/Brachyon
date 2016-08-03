import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TwitterConnect extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.linkWithTwitter({
    }, function(err){
      if(err){
        console.log(err);
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Integrated with Twitter!", "Success!");
      }
    })
  }

  render() {
    if(Meteor.user().services.twitter == null) {
      return (
        <button onClick={this.onClick.bind(this)} >
          <FontAwesome style={{marginRight: 10}} name="twitter" />
          Connect to Twitter
        </button>
      );
    }
    else {
      return (
        <div>Already connected to Twitter!</div>
      )
    }
  }
}
