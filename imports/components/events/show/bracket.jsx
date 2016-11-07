import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";
import SwissDisplay from "../../tournaments/swiss/display.jsx";
import RoundDisplay from "../../tournaments/roundrobin/display.jsx";

export default class BracketPanel extends Component {

  startEventHandler(e) {
    e.preventDefault();
    Meteor.call("events.start_event", this.props.eid, this.props.format, function(err) {
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
      else if (this.props.format == "double_elim"){
        return (
          <DoubleDisplay rounds={this.props.rounds} id={this.props.id} />
        )
      }
      else if (this.props.format == "swiss"){
        return (
          <SwissDisplay rounds={this.props.rounds} id={this.props.id} />
        )
      }
      else {
        return (
          <RoundDisplay rounds={this.props.rounds} id={this.props.id} />
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
