import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";
import SwissDisplay from "../../tournaments/swiss/display.jsx";
import RoundDisplay from "../../tournaments/roundrobin/display.jsx";
import TrackerReact from "meteor/ultimatejs:tracker-react"

export default class BracketPanel extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      bracket: Meteor.subscribe("brackets", props.id, {
        onReady: () => {
          this.setState({
            ready: true
          })
        }
      }),
      ready: false
    }
  }

  componentWillUnmount(){
    this.state.bracket.stop();
  }

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
    if(this.state.ready) {
      var rounds = Brackets.findOne().rounds;
      if(this.props.format == "single_elim") {
        return (
          <SingleDisplay rounds={rounds} id={this.props.id} />
        )
      }
      else if (this.props.format == "double_elim"){
        return (
          <DoubleDisplay rounds={rounds} id={this.props.id} />
        )
      }
      else if (this.props.format == "swiss"){
        return (
          <SwissDisplay rounds={rounds} id={this.props.id} />
        )
      }
      else {
        return (
          <RoundDisplay rounds={rounds} id={this.props.id} />
        )
      }
    }
    else {
      return (
        <p>Loading...</p>
      )
    }
  }
}
