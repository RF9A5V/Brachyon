import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";

export default class BracketPanel extends Component {

  startEventHandler(e) {
    e.preventDefault();
    Meteor.call("events.start_event", this.props.id, function(err) {
      if(err){
        console.log(err);
        toastr.error(err.reason, "Error!");
      }
    });
  }

  render() {
    if(this.props.rounds) {
      if(this.props.format == "single_elim") {
        return (
          <SingleDisplay rounds={this.props.rounds} id={this.props.id} />
        )
      }
      else {
        return (
          <DoubleDisplay rounds={this.props.rounds} id={this.props.id} />
        )
      }
    }
    else {
      return (
        <div>
          <button onClick={this.startEventHandler.bind(this)}>Start this Event</button>
        </div>
      )
    }
  }
}
