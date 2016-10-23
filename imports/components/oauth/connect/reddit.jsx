import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class RedditConnect extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.linkWithReddit({
    }, function(err){
      if(err){
        console.log(err);
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Integrated with Reddit!", "Success!");
      }
    })
  }

  render() {
    if(Meteor.user().services.google == null) {
      return (
        <button onClick={this.onClick.bind(this)}>
          <FontAwesome style={{marginRight: 10}} name="reddit" />
          Connect to Reddit
        </button>
      );
    }
    else {
      return (
        <div>Already connected to Reddit!</div>
      )
    }
  }
}
