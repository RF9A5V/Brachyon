import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";
import SwissDisplay from "../../tournaments/swiss/display.jsx";
import RoundDisplay from "../../tournaments/roundrobin/display.jsx";

import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";
import TrackerReact from "meteor/ultimatejs:tracker-react"

export default class BracketPanel extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      bracket: null,
      open: false
    }
  }

  componentWillUnmount(){
    if (this.state.bracket)
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
    var br = Meteor.subscribe("brackets", this.props.id, {
      onReady: () => {
        this.setState({
          ready: true,
          bracket: br,
          open: true
        });
      }
    });
    if(this.state.ready) {
      var rounds = Brackets.findOne().rounds;
      var component = (
        <div></div>
      )
      if(this.props.format == "single_elim") {
        component =  (
          <SingleDisplay rounds={rounds} id={this.props.id} />
        )
      }
      else if (this.props.format == "double_elim"){
        component = (
          <DoubleDisplay rounds={rounds} id={this.props.id} />
        )
      }
      else if (this.props.format == "swiss"){
        component = (
          <SwissDisplay rounds={rounds} id={Events.findOne()._id} />
        )
      }
      else {
        component = (
          <RoundDisplay rounds={rounds} id={Events.findOne()._id} />
        )
      }
      var bracketComplete;
      if(this.props.format == "single_elim" || this.props.format == "double_elim") {
        bracketComplete = Brackets.find().fetch()[0].complete
      }
      else {
        bracketComplete = Brackets.find().fetch()[0].rounds.pop().matches.every(match => { return match.played });
      }
      console.log(bracketComplete);
      var showModal = Events.findOne().league != null && bracketComplete && this.state.open;
      console.log(showModal);
      return (
        <div>
          {
            showModal ? (
              <LeagueModal open={showModal} close={() => { this.setState({open: false}) }} />
            ) : (
              ""
            )
          }
          { component }
        </div>
      )
    }
    else {
      return (
        <p>Loading...</p>
      )
    }
  }
}
