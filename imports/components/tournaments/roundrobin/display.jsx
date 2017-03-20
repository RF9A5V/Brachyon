import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import RoundMatchBlock from "./match.jsx"
import RoundModal from "./modal.jsx";

//Called by: imports\components\events\show\bracket.jsx
export default class RoundDisplay extends Component {
  // Page = 0 Will access the leaderboard
  // Page > 0 Will access rounds[page - 1]
  constructor(props)
  {
    super(props);
    var bracket = Brackets.findOne(props.bracketId);
    var instance = Instances.findOne();
    var rounds = bracket.rounds;

    var page = rounds.length - 1;
    var num = 0;
    for (var x = 0; x < rounds[page].matches.length; x++)
    {
      if (rounds[page].matches[x].played != false)
        num++;
    }
    rec = rounds[0].players.length;
    if (rounds[0].players.length%2 == 1)
      rec--;

    var event = Events.findOne();
    var aliasMap = {};
    if(event) {
      var instance = Instances.findOne(Events.findOne().instances.pop());
      instance.brackets[0].participants.forEach((player) => {
        aliasMap[player.alias] = player.id;
      })
    }
    else {
      bracket.rounds[0].players.forEach(p => {
        const user = Meteor.users.findOne({ username: p.name });
        aliasMap[p.name] = user ? user._id : null
      })
    }


    this.state = {
      page: page + 1,
      wcount: num,
      recrounds: rec,
      brid: bracket._id,
      id: props.bracketId || Events.findOne()._id,
      iid: instance._id,
      aliasMap,
      rounds
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
        if(this.props.update) {
          this.props.update();
        }
      }
    });

  }

  newRound() {
    var rounds = Brackets.findOne(this.props.bracketId).rounds;
    if (!(this.state.wcount == rounds[this.state.page - 1].matches.length))
      toastr.error("Not everyone has played! Only " + this.state.wcount + " out of " + rounds[this.state.page - 1].matches.length + "!", "Error!");
    Meteor.call("events.update_roundrobin", this.state.brid, this.state.page - 1, 3, (err) => {
      if(err){

        toastr.error("Couldn't update the round.", "Error!");
      }
      else {
        toastr.success("New Round!");
        if(this.props.update) {
          this.props.update();
        }
        this.setState({wcount: 0, page: this.state.page + 1});
      }
    });
  }

  endTourn(){
    Meteor.call("events.endGroup", this.props.id, 0, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Ended bracket!", "Success!");
      }
    })

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
    if(!match.played && this.state.page == this.state.rounds.length) {
      this.setState({
        open: true,
        match,
        i
      })
    }
  }

  render() {
    var bracket = Brackets.findOne(this.props.bracketId);
    var rounds = bracket.rounds;
    var sortedplayers = rounds[rounds.length-1].players;
    sortedplayers.sort(function(a, b) {
      return b.score - a.score;
    })
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
            _.range(1, rounds.length + 1).map((val) => {
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
              rounds[this.state.page - 1].matches.map((match, i) => {
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
              (this.state.page == rounds.length && this.state.wcount == rounds[this.state.page - 1].matches.length) ? (
                <button onClick={ () => {this.endTourn()} }>
                  Finish Tournament
                </button>
              ) : (
                ""
              )
            ) : (
              this.state.page == rounds.length && this.state.wcount == rounds[this.state.page - 1].matches.length) ? (
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
            <RoundModal id={this.props.bracketId} onRequestClose={this.closeModal.bind(this)} finalizeMatch={this.finalizeMatch.bind(this)} match={this.state.match} i={this.state.i} open={this.state.open} page={this.state.page - 1} aliasMap={this.state.aliasMap} />
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
