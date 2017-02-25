import React, { Component } from "react";

export default class ForgotPassScreen extends Component {

  onSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    toastr.warning("Sending password reset email...");
    Meteor.call("users.requestPWReset", this.refs.email.value, (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully sent password reset to your account!");
      }
    })
  }

  render() {
    return (
      <div className="col-1 col center x-center">
        <span>Text goes here</span>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" ref="email" placeholder="Email" />
          <input type="submit" />
        </form>
      </div>
    )
  }
}
