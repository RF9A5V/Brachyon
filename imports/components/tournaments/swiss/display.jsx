import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import SwissMatchBlock from "./match.jsx"
import SwissModal from "./modal.jsx";
import Brackets from "/imports/api/brackets/brackets.js"

import Instances from "/imports/api/event/instance.js";

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends Component {
  // Page = 0 Will access the leaderboard
  // Page > 0 Will access rounds[page - 1]
  constructor(props)
  {
    super(props);
    var bracket = Brackets.findOne();
    var instance = Instances.findOne();
    var rounds = bracket.rounds;

    var page = rounds.length - 1;
    var num = 0;
    for (var x = 0; x < rounds[page].length; x++)
    {
      if (rounds[page][x].played != false)
        num++;
    }
    rec = Math.ceil(Math.log2(rounds.players.length));

    var aliasMap = {};
    instance.brackets[0].participants.forEach((player) => {
      aliasMap[player.alias] = player.id;
    })

    this.state = {
      iid: instance._id,
      page: page + 1,
      wcount: num,
      recrounds: rec,
      brid: bracket._id,
      aliasMap,
      rounds,
      updateMatch: false,
      sub: false
    }
  }

  componentWillUnmount() {
    if (this.state.sub)
      this.state.sub.stop();
  }

  componentDidUpdate() {
    if (this.state.updateMatch)
    {
      var rounds = Brackets.findOne().rounds;
      var sub = Meteor.subscribe("Matches", rounds, {
        onReady: () => {
          this.setState({updateMatch: false, sub, wcount: 0, page: rounds.length})
        }
      });
    }
  }

  updateBoard()
  {
    var rounds = Brackets.findOne().rounds;
    this.setState({rounds});
    this.forceUpdate();
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
        this.updateBoard();
      }
    });

  }

  newRound() {
    var oldrounds = Brackets.findOne().rounds;
    if (!(this.state.wcount == this.state.rounds[this.state.page - 1].length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.state.rounds[this.state.page - 1].length + "!", "Error!");
    Meteor.call("events.update_round", this.state.brid, this.state.page - 1, 3, (err) => {
      if(err){

        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
        this.setState({updateMatch: true});
        this.updateBoard();
      }
    });
  }

  endTourn(){
    Meteor.call("events.tiebreaker", this.state.brid, this.state.page-1, 3, (err, isNotTied) => {
      if(err) {
        toastr.error(err.reason, "Error!")
      }
      else {
        if (isNotTied)
        {
          Meteor.call("events.endGroup", this.state.iid, 0, (error) => {
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

  getBuchholz(players, pnum)
  {
    var targetPlayer = players[pnum];
    var buchholzNumber = 0;
    for (var x = 0; x < players.length; x++)
    {
      if (targetPlayer.playedagainst[players[x].name])
        buchholzNumber += players[x].wins;
    }
    return buchholzNumber;
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
            _.range(1, this.state.rounds.length + 1).map((val) => {
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
                      Wins / Losses / Ties
                    </div>
                    <div className="swiss-header">
                      Buchholz Rating
                    </div>
                  </div>
                  {
                    this.state.rounds.players.sort((a, b) => {
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
                            { playerObj.wins + " / " + playerObj.losses + " / " + playerObj.ties }
                          </div>
                          <div className="swiss-entry">
                            { this.getBuchholz(this.state.rounds.players, i) }
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
            (this.state.page > 0 && this.state.rounds[this.state.page - 1]) ? (
              this.state.rounds[this.state.page - 1].map((match, i) => {
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
            this.state.page >= (this.state.recrounds) && this.state.rounds[this.state.page - 1] && this.state.wcount == this.state.rounds[this.state.page - 1].length && Instances.findOne().brackets[0].endedAt == null ? (
              <button onClick={ () => {this.endTourn()} }>
                Finish Tournament
              </button>
            ) : (
              this.state.page == this.state.rounds.length && this.state.wcount == this.state.rounds[this.state.page - 1].length) && Instances.findOne().brackets[0].endedAt == null ? (
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
            <SwissModal onRequestClose={this.closeModal.bind(this)} finalizeMatch={this.finalizeMatch.bind(this)} i={this.state.i} open={this.state.open} page={this.state.page - 1} aliasMap={this.state.aliasMap} update={this.updateBoard.bind(this)} />
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
