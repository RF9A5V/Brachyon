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
        <div className="submodule-bg" style={{marginTop: 10}}>
          <div className="col x-center">
            <h3 style={{marginBottom: 20}}>Submit your event for review.</h3>
            <button onClick={this.onEventSubmit.bind(this)}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
}
