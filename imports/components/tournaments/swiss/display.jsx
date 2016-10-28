import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import SwissMatchBlock from "./match.jsx"

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {

  constructor(props)
  {
    super(props);
    var page = this.props.rounds.length-1;
    var num = 0;
    for (var x = 0; x < this.props.rounds[page].matches.length; x++)
    {
      if (this.props.rounds[page].matches[x].played != false)
        num++;
    }
    rec = Math.ceil(Math.log2(this.props.rounds[0].players.length));
    console.log(rec);
    this.state = {
      page: page,
      wcount: num,
      recrounds: rec
    }
  }

  declareWinner(score, win1, win2, ties, matchnumber)
  {
      console.log(win1);
      console.log(this.state.playerone)
      Meteor.call("events.update_match", this.props.id, this.state.page, matchnumber, score, win1, win2, ties, function(err) {
        if(err){
          console.log(err);
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          var wcount = this.state.wcount+1;
          toastr.success("Players " + wcount + " advanced to next round!", "Success!");
        }
      });
      var wcount = this.state.wcount+1;
      this.setState({wcount: wcount});
  }

  newRound() {
    if (!(this.state.wcount == this.props.rounds[this.state.page].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.props.rounds[this.state.page].matches.length + "!", "Error!");
    Meteor.call("events.update_round", this.props.id, this.state.page, 3, function(err) {
      if(err){
        console.log(err);
        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
      }
    });
    var page = this.state.page+1;
    this.setState({wcount: 0, page: page});
  }

  endTourn(){
    return;
  }

  render() {
    return (
      <div className="col">
        <div className="center">
        <h2>{"Round " + (this.state.page+1)}</h2>
        </div>
        <div className="row flex-pad">
          <div>
          {
            this.state.page > 0 ? (
              <button onClick={ () => {this.setState({page: this.state.page-1})} }>{"<-- Prev"}</button>
            ):("")
          }
          </div>
          <div>
          {
            this.state.page < this.props.rounds.length-1 ? (
              <button onClick={ () => {this.setState({page: this.state.page+1})} } >{"Next -->"}</button>
            ):("")
          }
          </div>
        </div>
        <div className="row">
          <div className="col">
          {
              this.props.rounds[this.state.page].players.map((playerObj, i) => {
                return (
                  <div>{playerObj.name + " S: " + playerObj.score + " W: " + playerObj.wins + " L: " + playerObj.losses}</div>
                );
              })
          }
          </div>
          <div className="row" id="RoundDiv">
          {
            this.props.rounds[this.state.page].matches.map((match, i) => {
              return(
                <SwissMatchBlock page={this.state.page} declareWinner={this.declareWinner.bind(this)} i={i} match={match} rounds={this.props.rounds} />
              );
            })
          }
          </div>
          <div>
          {
            (this.state.page >= (this.state.recrounds - 1) ) ? (
              <button onClick={ () => {this.endTourn().bind(this)} }>
              Finish Tournament
              </button>
            ):
            (this.state.page == this.props.rounds.length-1 && this.state.wcount == this.props.rounds[this.state.page].matches.length) ? (
              <button onClick={ () => {this.newRound().bind(this)} }>
              Advance Round
              </button>
            ):
            ( "" )
          }
          </div>
        </div>
      </div>
    )
  }
}
