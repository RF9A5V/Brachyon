import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal"
import { browserHistory } from "react-router";

import Matches from "/imports/api/event/matches.js";

export default class LeagueModal extends Component {

  constructor(props) {
    super(props);
    var bracketIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
    this.state = {
      league: Meteor.subscribe("leagueByID", Events.findOne().league, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      bracketIndex
    };
  }

  componentWillUnmount() {
    this.state.league.stop();
  }

  closeModal() {
    this.props.close();
  }

  boardFormatting(ldrboard) {
    var participantCount = Instances.findOne().brackets[this.state.bracketIndex].participants.length;
    var eventIndex = Leagues.findOne().events.indexOf(Events.findOne().slug);
    var leaderboard = Leagues.findOne().leaderboard[eventIndex + 1];
    return (
      <div style={{maxHeight: 300, overflowY: "auto"}}>
        <div className="row">
          <div className="col-1">
            Position
          </div>
          <div className="col-1">
            Username
          </div>
          <div className="col-1">
            Points
          </div>
          <div className="col-1">
            Bonus
          </div>
        </div>
        {
          Object.keys(ldrboard).sort((a, b) => {
            var [win1, los1] = a.split("-").map(i => parseInt(i));
            var [win2, los2] = b.split("-").map(i => parseInt(i));
            if(los1 != los2) {
              return (los1 < los2 ? -1 : 1);
            }
            else {
              return (win1 < win2 ? 1 : -1);
            }
          }).map((users, i) => {
            users = ldrboard[users];
            return users.map(user => {
              return (
                <div className="row x-center" style={{marginBottom: 10}}>
                  <div className="col-1">
                    { i + 1 }
                  </div>
                  <div className="col-1">
                    { user.alias }
                  </div>
                  <div className="col-1">
                    { participantCount - i  } +
                  </div>
                  <div className="col-1">
                    <input type="text" style={{width: "100%", margin: 0, fontSize: 12}} onChange={(e) => {
                      if(isNaN(e.target.value)) {
                        e.target.value = e.target.value.slice(0, e.target.value.length - 1)
                      } else {
                        this.forceUpdate();
                      } }} onKeyPress={(e) => {
                        if(e.key == "Enter") {
                          e.target.blur();
                        }
                      }} onBlur={(e) => {
                        Meteor.call("leagues.leaderboard.setBonus", Leagues.findOne()._id, eventIndex + 1, user.id, parseInt(e.target.value), (err) => {
                          if(err) {
                            toastr.error("Couldn\'t update bonus points!");
                          }
                        })
                      }} defaultValue={leaderboard[leaderboard.findIndex(p => { return p.id == user.id })].bonus}
                    />
                  </div>
                </div>
              )
            })
          })
        }
      </div>
    );
  }

  doubleElimLeaderboard() {
    var roundobj = Brackets.findOne();
    var obj = {};
    var participants = Instances.findOne().brackets[this.state.bracketIndex].participants;
    participants.forEach(p => {
      var total = Matches.find({
        "players.alias": p.alias
      }).fetch().length;
      var wins = Matches.find({
        "winner.alias": p.alias
      }).fetch().length;
      var losses = total - wins;
      var score = `${wins}-${losses}`;
      if(!obj[score]) {
        obj[score] = [p];
      }
      else {
        obj[score].push(p);
      }
    });
    return this.boardFormatting(obj);
  }

  swissLeaderboard() {
    var ldrboard = {};
    var rounds = Brackets.findOne().rounds;
    rounds[rounds.length - 1].players.sort((a, b) => { return b.score - a.score; }).forEach((p, i) => {
      ldrboard[p.name] = i;
    });
    return this.boardFormatting(ldrboard);
  }

  rrLeaderboard() {
    return this.swissLeaderboard();
  }

  boardType() {
    switch(Instances.findOne().brackets[this.state.bracketIndex].format.baseFormat) {
      case "single_elim":
        return this.doubleElimLeaderboard();
      case "double_elim":
        return this.doubleElimLeaderboard();
      case "swiss":
        return this.swissLeaderboard();
      case "round_robin":
        return this.rrLeaderboard();
      default:
        return (<div></div>)
    }
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
        </div>
      )
    }
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.closeModal.bind(this)}>
        <div className="row">
          <div className="col-1"></div>
          <FontAwesome name="times" size="2x" onClick={this.closeModal.bind(this)} />
        </div>
        <div className="row center" style={{marginBottom: 10}}>
          <h5>Close Your Bracket</h5>
        </div>
        { this.boardType() }
        <div className="row center">
          <button onClick={this.closeModal.bind(this)} style={{marginRight: 20}}>Cancel</button>
          <button onClick={ () => {
            var format = Instances.findOne().brackets[this.state.bracketIndex].format.baseFormat;
            if(format == "single_elim" || format == "double_elim") {
              Meteor.call("events.brackets.close", Events.findOne()._id, this.state.bracketIndex, (err) => {
                if(err) {
                  console.log(err);
                  return toastr.error("Couldn\'t close this bracket.", "Error!");
                }
                var allBracketsComplete = Instances.findOne().brackets.map(b => { return b.isComplete == true }).every(el => { return el });
                if(allBracketsComplete) {
                  Meteor.call("events.close", Events.findOne()._id, (err) => {
                    if(err) {
                      return toastr.error("Couldn\'t close the event.", "Error!");
                    }
                    var leaguePath = Leagues.findOne();
                    browserHistory.push("/league/"+leaguePath.slug+"/leaderboard");
                  })
                }
              })
            }
            else {
              Meteor.call("events.endGroup", Events.findOne()._id, this.state.bracketIndex, (err) => {
                if(err) {
                  return toastr.error("Couldn\'t close this bracket.", "Error!");
                }
                var allBracketsComplete = Instances.findOne().brackets.map(b => { return b.isComplete == true }).every(el => { return el });
                if(allBracketsComplete) {
                  Meteor.call("events.close", Events.findOne()._id, (err) => {
                    if(err) {
                      return toastr.error("Couldn\'t close the event.", "Error!");
                    }
                    var leaguePath = Leagues.findOne();
                    browserHistory.push("/league/"+leaguePath.slug+"/leaderboard");
                  })
                }
              })
            }
          }}>Finalize</button>
        </div>
      </Modal>
    )
  }
}
