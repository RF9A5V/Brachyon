import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class SubmitPage extends Component {

  constructor() {
    super();
    Meteor.call("events.submit", Events.findOne()._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Published event!", "Success!");
        browserHistory.push("/");
      }
    });
  }

  render() {
    return null;
  }
}
