import React, { Component } from "react";
import SingleDisplay from "../../tournaments/single/display.jsx";
import DoubleDisplay from "../../tournaments/double/display.jsx";
import SwissDisplay from "../../tournaments/swiss/display.jsx";
import RoundDisplay from "../../tournaments/roundrobin/display.jsx";

import WinnersBracket from "/imports/components/tournaments/double/winners.jsx";

import EventModal from "../../tournaments/modal.jsx";
import LeagueModal from "/imports/components/tournaments/public_comps/league_modal.jsx";
import TrackerReact from "meteor/ultimatejs:tracker-react"

export default class BracketPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      leagueOpen: true
    }
  }

  startEventHandler(e) {
    e.preventDefault();
    Meteor.call("events.start_event", this.props.eid, this.props.format, function(err) {
      if(err){

        toastr.error(err.reason, "Error!");
      }
    });
  }

  toggleModal(id, b, r, i) {
    this.setState({
      id,
      bracket: b,
      round: r,
      match: i,
      open: true
    });
  }

  internalRender() {
    var rounds = this.props.rounds;
    var component = (
      <div></div>
    );
    const id = Brackets.findOne()._id;
    if(this.props.format == "single_elim") {
      component =  (
        <WinnersBracket rounds={rounds} id={this.props.id} update={this.forceUpdate.bind(this)} onMatchClick={this.toggleModal.bind(this)} />
      )
    }
    else if (this.props.format == "double_elim"){
      component = (
        <DoubleDisplay rounds={rounds} id={this.props.id} update={this.forceUpdate.bind(this)} onMatchClick={this.toggleModal.bind(this)} />
      )
    }
    else if (this.props.format == "swiss"){
      component = (
        <SwissDisplay rounds={rounds} id={this.props.id} update={this.forceUpdate.bind(this)} />
      )
    }
    else {
      component = (
        <RoundDisplay rounds={rounds} bracketId={id} update={this.forceUpdate.bind(this)} />
      )
    }
    var bracketComplete;
    var bracket = Brackets.findOne();
    if(this.props.format == "single_elim" || this.props.format == "double_elim") {
      if(bracket) {
        bracketComplete = Brackets.findOne().complete;
      }
      else {
        bracketComplete = false;
      }
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
          Brackets.findOne() && !bracketComplete ? (
            <EventModal
              id={this.state.id}
              bracket={this.state.bracket}
              round={this.state.round}
              match={this.state.match}
              open={this.state.open}
              closeModal={() => { this.setState({open: false}) }}
              update={this.forceUpdate.bind(this)}
              format={this.props.format}
            />
          ) : (
            ""
          )
        }
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
            <LeagueModal open={this.state.leagueOpen} close={() => { this.setState({open: false}) }} />
          ) : (
            ""
          )
        }
        { component }
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4>Bracket</h4>
        <div className="submodule-bg">
          { this.internalRender() }
        </div>
      </div>
    )
  }
}
