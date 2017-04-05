import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class ShortLinkScreen extends Component {

  constructor(props) {
    super(props);
    Meteor.call("getLongUrl", props.params.id, (err, data) => {
      if(err) {
        toastr.error("Error grabbing short URL.");
        browserHistory.push("/");
      }
      else {
        browserHistory.push(data);
      }
    });
  }

  render() {
    return null;
  }
}
