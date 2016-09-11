import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class SubmitPage extends Component {

  constructor() {
    super();
    this.state = {
      id: Events.findOne()._id
    }
  }

  onEventSubmit() {
    Meteor.call("events.submit", this.state.id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Published event!", "Success!");
        browserHistory.push("/");
      }
    })
  }

  render() {
    return (
      <div>
        <span>Submit your event for publishing.</span>
        <button onClick={this.onEventSubmit.bind(this)}>Submit</button>
      </div>
    )
  }
}
