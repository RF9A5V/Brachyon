import React, { Component } from "react";

export default class SubmitPanel extends Component {

  onClick(e) {
    Meteor.call("events.submit", this.props.id, function(err) {
      if(err){
        toastr.error("Issue submitting event. Call an admin!");
      }
      else {
        window.location = "/";
      }
    })
  }

  render() {
    return (
      <div>
        <h2>Submit Your Event</h2>
        <i>If you've used the revenue feature, your event will require us to manually approve your event for publishing.</i>
        {
          this.props.requiresApproval ? (
            <button onClick={this.onClick.bind(this)}>Submit For Approval</button>
          ) : (
            <button onClick={this.onClick.bind(this)}>Publish</button>
          )
        }
      </div>
    )
  }
}
