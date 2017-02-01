import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import BracketFormat from "./bracket_format.jsx";
import GroupFormat from "./group_format.jsx";

import Matches from "/imports/api/event/matches.js";

export default class MatchShowScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: Meteor.subscribe("event", props.params.slug, {
        onReady: () => {
          this.setState({
            bracket: Meteor.subscribe("brackets", Instances.findOne().brackets[props.params.bracketIndex].id, {
              onReady: () => {
                this.setState({
                  isReady: true
                })
              }
            })
          })
        }
      }),
      isReady: false
    }
  }

  ties() {
    var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
    var format = Instances.findOne().brackets[this.props.params.bracketIndex].format.baseFormat;
    var cb = (multi) => {
      var id = Brackets.findOne()._id;
      var round = this.props.params.round - 1;
      var matchIndex = this.props.params.match - 1;
      var score = 3;
      var p1score = match.p1score;
      var p2score = match.p2score;
      var ties = Math.max(match.ties + (1 * multi), 0);
      Meteor.call(format == "swiss" ? "events.update_match" : "events.update_roundmatch", id, round, matchIndex, score, p1score, p2score, ties, (err) => {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        this.forceUpdate();
      })
    }
    return (
      <div>
        <h5 style={{marginBottom: 10}}>Ties</h5>
        <div className="row center x-center">
          {
            match.ties <= 0 ? (
              <FontAwesome name="caret-left" size="2x" style={{color: "#666"}} />
            ) : (
              <FontAwesome name="caret-left" size="2x" onClick={() => { cb(-1) }} />
            )
          }
          <h5 style={{margin: "0 10px"}}>{ match.ties }</h5>
          <FontAwesome name="caret-right" size="2x" onClick={() => { cb(1) }} />
        </div>
      </div>
    )
  }

  render() {
    if(!this.state.isReady) {
      return (
        <div></div>
      )
    }
    var comps = [];
    // Warning: This'll probably have to change when we deal with complex bracket systems.
    var format = Instances.findOne().brackets[this.props.params.bracketIndex].format.baseFormat;
    if(format == "single_elim" || format == "double_elim") {
      var matchId = Brackets.findOne().rounds[this.props.params.bracket][this.props.params.round][this.props.params.match].id;
      var match = Matches.findOne(matchId);
      var players = [
        {
          name: match.players[0].alias,
          score: match.players[0].score
        },
        {
          name: match.players[1].alias,
          score: match.players[1].score
        }
      ];
      comps = players.map((p, i) => {
        return (
          <BracketFormat params={this.props.params} p={p} i={i} parentUpdate={this.forceUpdate.bind(this)} />
        );
      });
    }
    else {
      var match = Brackets.findOne().rounds[this.props.params.round - 1].matches[this.props.params.match - 1];
      var players = [
        {
          name: match.playerOne,
          score: match.p1score
        },
        {
          name: match.playerTwo,
          score: match.p2score
        }
      ];
      comps = players.map((p, i) => {
        return (
          <GroupFormat params={this.props.params} p={p} i={i} parentUpdate={this.forceUpdate.bind(this)} />
        )
      })
    }
    comps.splice(1, 0, (
      <h1>VERSUS</h1>
    ));
    return (
      <div className="col center x-center" style={{height: "calc(100vh - 110px)"}}>
        <div style={{position: "fixed", left: 20, top: 80}}>
          <button onClick={() => { browserHistory.goBack() }}>
            Back
          </button>
        </div>
        <div className="row flex-pad x-center" style={{width: "50%", margin: "0 auto"}}>
          {
            comps
          }
        </div>
        {
          (format == "swiss" || format == "round_robin") && !match.played ? (
            this.ties()
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
