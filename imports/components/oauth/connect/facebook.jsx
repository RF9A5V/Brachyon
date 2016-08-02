import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class FacebookConnect extends Component {

  onClick(e) {
    e.preventDefault();
    Meteor.linkWithFacebook({
      requestPermissions: ["email", "public_profile"]
    }, function(err){
      if(err){
        console.log(err);
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Integrated with Facebook!", "Success!");
      }
    })
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
        <div>Already connected to Facebook!</div>
      )
    }
  }
}
