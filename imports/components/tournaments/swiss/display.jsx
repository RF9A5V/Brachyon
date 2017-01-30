import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import SwissMatchBlock from "./match.jsx"
import SwissModal from "./modal.jsx";
import Brackets from "/imports/api/brackets/brackets.js"

import Instances from "/imports/api/event/instance.js";

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {
  // Page = 0 Will access the leaderboard
  // Page > 0 Will access rounds[page - 1]
  constructor(props)
  {
    super(props);
    var page = this.props.rounds.length - 1;
    var num = 0;
    for (var x = 0; x < this.props.rounds[page].matches.length; x++)
    {
      if (this.props.rounds[page].matches[x].played != false)
        num++;
    }
    rec = Math.ceil(Math.log2(this.props.rounds[0].players.length));

    var bracket = Brackets.findOne();
    var instance = Instances.findOne();

    var aliasMap = {};
    instance.brackets[0].participants.forEach((player) => {
      aliasMap[player.alias] = player.id;
    })

    this.state = {
      page: page + 1,
      wcount: num,
      recrounds: rec,
      brid: bracket._id,
      aliasMap
    }
  }

  finalizeMatch(matchnumber)
  {
    Meteor.call("events.complete_match", this.state.brid, this.state.page - 1, matchnumber, (err) => {
      if(err){
        toastr.error("Couldn't complete the match.", "Error!");
      }
      else {
        toastr.success("Match finalized!", "Success!");
        this.setState({wcount: this.state.wcount + 1});
        this.props.update();
      }
    });

  }

  newRound() {
    if (!(this.state.wcount == this.props.rounds[this.state.page - 1].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.props.rounds[this.state.page - 1].matches.length + "!", "Error!");
    Meteor.call("events.update_round", this.state.brid, this.state.page - 1, 3, (err) => {
      if(err){
        console.log(err);
        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
        this.props.update();
      }
    });
    this.setState({wcount: 0, page: this.state.page + 1});
  }

  endTourn(){
    Meteor.call("events.tiebreaker", this.state.brid, this.state.page-1, 3, (err, isNotTied) => {
      if(err) {
        toastr.error(err.reason, "Error!")
      }
      else {
        if (isNotTied)
        {
          Meteor.call("events.endGroup", this.props.id, 0, (error) => {
            if(error) {
              toastr.error(error.reason, "Error!");
            }
            else {
              toastr.success("Ended bracket!", "Success!");
            }
          })
        }
        else //Hope this doesn't happen cuz some potentially janky shit I'd need to fix happens
        {
          this.newRound();
        }
      }
    });
  }

  openModal(args) {
    this.setState({
      open: true,
      match: args.match,
      i: args.i
    })
  }

  closeModal() {
    this.setState({
      open: false,
      match: null,
      i: null
    })
  }

  onMatchClick(match, i) {
    this.setState({
      match,
      open: true,
      i
    });
  }

  render() {
    return (
      <div className="col">
        <div className="row center x-center">
          <h3>{this.state.page == 0 ? "Leaderboard" : "Round " + (this.state.page)}</h3>
        </div>
        <div className="row swiss-tabs">
          <div className={`swiss-tab-header ${this.state.page == 0 ? "active" : ""}`} onClick={() => { this.setState({ page: 0 }) }}>
            Leaderboard
          </div>
          {
            _.range(1, this.props.rounds.length + 1).map((val) => {
              return (
                <div className={`swiss-tab-header ${this.state.page == val ? "active" : ""}`} onClick={() => { this.setState({ page: val }) }}>
                  Round {val}
                </div>
              )
            })
          }
        </div>
        <div className="col">
            {
              this.state.page == 0 ? (
                <div className="col">
                  <div className="row swiss-row">
                    <div className="swiss-header">
                      Player
                    </div>
                    <div className="swiss-header">
                      Score
                    </div>
                    <div className="swiss-header">
                      Wins
                    </div>
                    <div className="swiss-header">
                      Losses
                    </div>
                  </div>
                  {
                    this.props.rounds[this.props.rounds.length-1].players.sort((a, b) => {
                      return b.score - a.score;
                      }).map((playerObj, i) => {
                      return (
                        <div className="row swiss-row">
                          <div className="swiss-entry">
                            { playerObj.name }
                          </div>
                          <div className="swiss-entry">
                            { playerObj.score }
                          </div>
                          <div className="swiss-entry">
                            { playerObj.wins }
                          </div>
                          <div className="swiss-entry">
                            { playerObj.losses }
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              ) : (
                ""
              )
            }
          <div className="row" style={{flexWrap: "wrap"}} id="RoundDiv">
          {
            this.state.page > 0 ? (
              Brackets.findOne().rounds[this.state.page - 1].matches.map((match, i) => {
                return (
                  <SwissMatchBlock key={i} match={match} onSelect={() => { this.onMatchClick(match, i) }} />
                );
              })
            ) : (
              ""
            )
          }
          </div>
          <div>
          {
            this.state.page >= (this.state.recrounds) && this.state.wcount == this.props.rounds[this.state.page - 1].matches.length && Instances.findOne().brackets[0].endedAt == null ? (
              <button onClick={ () => {this.endTourn()} }>
                Finish Tournament
              </button>
            ) : (
              this.state.page == this.props.rounds.length && this.state.wcount == this.props.rounds[this.state.page - 1].matches.length) && Instances.findOne().brackets[0].endedAt == null ? (
                <button onClick={ () => {this.newRound()} }>
                  Advance Round
                </button>
              ) : (
                ""
              )
          }
          </div>
        </div>
        {
          this.state.open ? (
            <SwissModal onRequestClose={this.closeModal.bind(this)} finalizeMatch={this.finalizeMatch.bind(this)} i={this.state.i} open={this.state.open} page={this.state.page - 1} aliasMap={this.state.aliasMap} update={this.forceUpdate.bind(this)} />
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
