import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";
import SwissDisplay from "../../tournaments/swiss/display.jsx";
import RoundDisplay from "../../tournaments/roundrobin/display.jsx";

import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";
import TrackerReact from "meteor/ultimatejs:tracker-react"

export default class BracketPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      bracket: Meteor.subscribe("brackets", this.props.id, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      open: true
    }
  }

  componentWillUnmount(){
    if(this.state.bracket)
      this.state.bracket.stop();
  }

  startEventHandler(e) {
    e.preventDefault();
    Meteor.call("events.start_event", this.props.eid, this.props.format, function(err) {
      if(err){

        toastr.error(err.reason, "Error!");
      }
    });
  }

  render() {
    if(this.state.ready) {
      var rounds = Brackets.findOne().rounds;
      var component = (
        <div></div>
      );
      if(this.props.format == "single_elim") {
        component =  (
          <SingleDisplay rounds={Brackets.findOne().rounds} id={this.props.id} update={this.forceUpdate.bind(this)} />
        )
      }
      else if (this.props.format == "double_elim"){
        component = (
          <DoubleDisplay rounds={Brackets.findOne().rounds} id={this.props.id} update={this.forceUpdate.bind(this)} />
        )
      }
      else if (this.props.format == "swiss"){
        component = (
          <SwissDisplay rounds={Brackets.findOne().rounds} id={this.props.id} update={this.forceUpdate.bind(this)} />
        )
      }
      else {
        component = (
          <RoundDisplay rounds={Brackets.findOne().rounds} id={this.props.id} update={this.forceUpdate.bind(this)} />
        )
      }
      var bracketComplete;
      if(this.props.format == "single_elim" || this.props.format == "double_elim") {
        bracketComplete = Brackets.findOne().complete;
      }
      else {
        var rounds = Brackets.findOne().rounds;
        var rec;
        if(this.props.format == "swiss") {
          rec = Math.ceil(Math.log2(rounds[0].players.length));
        }
        else {
          rec = rounds[0].players.length - (rounds[0].players.length % 2) - 1;
        }
        bracketComplete = rounds.length >= rec && rounds.pop().matches.every(match => { return match.played });
      }
      var event = Events.findOne();
      var showModal = event && event.league != null && bracketComplete && event.owner == Meteor.userId() && !event.isComplete;
      return (
        <div>
          {
            showModal ? (
              <div className="row" style={{marginBottom: 10, justifyContent: "flex-end"}}>
                <button onClick={() => { this.setState({ open: true }) }}>Close</button>
              </div>
            ) : (
              ""
            )
          }
          {
            showModal ? (
              <LeagueModal open={this.state.open} close={() => { this.setState({open: false}) }} />
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
