import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import RoundMatchBlock from "./match.jsx"
import RoundModal from "./modal.jsx";

//Called by: imports\components\events\show\bracket.jsx
export default class RoundDisplay extends TrackerReact(Component) {
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
    rec = this.props.rounds[0].players.length;
    if (this.props.rounds[0].players.length%2 == 1)
      rec--;

    var event = Events.findOne();
    var aliasMap = {};
    event.brackets[0].participants.forEach((player) => {
      aliasMap[player.alias] = player.id;
    })

    this.state = {
      page: page + 1,
      wcount: num,
      recrounds: rec,
      id: event._id,
      aliasMap
    }
  }

  finalizeMatch(matchnumber)
  {
    Meteor.call("events.complete_match", this.state.id, this.state.page - 1, matchnumber, (err) => {
      if(err){
        toastr.error("Couldn't complete the match.", "Error!");
      }
      else {
        toastr.success("Match finalized!", "Success!");
        this.setState({wcount: this.state.wcount + 1});
      }
    });

  }

  newRound() {
    if (!(this.state.wcount == this.props.rounds[this.state.page - 1].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + this.props.rounds[this.state.page - 1].matches.length + "!", "Error!");
    Meteor.call("events.update_roundrobin", this.state.id, this.state.page - 1, 3, function(err) {
      if(err){
        console.log(err);
        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
      }
    });
    this.setState({wcount: 0, page: this.state.page + 1});
  }

  endTourn(){
    return;
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
    if(!match.played && this.state.page == this.props.rounds.length) {
      this.setState({
        open: true,
        match,
        i
      })
    }
  }

  render() {
    var sortedplayers = this.props.rounds[this.props.rounds.length-1].players;
    sortedplayers.sort(function(a, b) {
      return b.score - a.score;
    })
    return (
      <div className="col">
        <div className="row center x-center">
          <h2>{this.state.page == 0 ? "Leaderboard" : "Round " + (this.state.page)}</h2>
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
                    sortedplayers.map((playerObj, i) => {
                      if (playerObj.name != "")
                      {
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
                      }
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
              this.props.rounds[this.state.page - 1].matches.map((match, i) => {
                return (
                  <RoundMatchBlock match={match} onSelect={() => { this.onMatchClick(match, i) }} />
                );
              })
            ) : (
              ""
            )
          }
          </div>
          <div>
          {
            this.state.page >= (this.state.recrounds-1) ? (
              <button onClick={ () => {this.endTourn().bind(this)} }>
                Finish Tournament
              </button>
            ) : (
              this.state.page == this.props.rounds.length && this.state.wcount == this.props.rounds[this.state.page - 1].matches.length) ? (
                <button onClick={ () => {this.newRound().bind(this)} }>
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
            <RoundModal onRequestClose={this.closeModal.bind(this)} finalizeMatch={this.finalizeMatch.bind(this)} match={this.state.match} i={this.state.i} open={this.state.open} page={this.state.page - 1} aliasMap={this.state.aliasMap} />
          ) : (
            ""
          )
        }
      </div>
    )
  }
}