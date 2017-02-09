import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class GoogleConnect extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.linkWithGoogle({
    }, function(err){
      if(err){
        
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Integrated with Google!", "Success!");
      }
    })
  }

  render() {
    if(Meteor.user().services.google == null) {
      return (
        <button onClick={this.onClick.bind(this)}>
          <FontAwesome style={{marginRight: 10}} name="google" />
          Connect to Google
        </button>
      );
    }
    else {
      return (
        <div>Already connected to Google!</div>
      )
    }
  }
}
