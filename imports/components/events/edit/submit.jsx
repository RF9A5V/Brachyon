import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class SubmitPanel extends Component {

  onClick(e) {
    Meteor.call("events.submit", this.props.id, function(err) {
      if(err){
        toastr.error("Issue submitting event. Call an admin!");
      }
      else {
        browserHistory.push("/");
      }
    })
  }

  render() {
    return (
      <div>
        <h2>Submit Your Event</h2>
        <i>If you've used the revenue feature, your event will require us to manually approve your event for publishing.</i>
        <button onClick={this.onClick.bind(this)}>
          {
            this.props.requiresApproval ? (
              "Submit For Approval"
            ) : (
              "Publish"
            )
          }
        </button>
      </div>
    )
  }
}
