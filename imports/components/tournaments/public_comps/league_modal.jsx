import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal"
import { browserHistory } from "react-router";

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
    var totalPoints = Object.keys(ldrboard).length;
    var localBoard = {};
    var eventIndex = Leagues.findOne().events.indexOf(Events.findOne().slug);
    Leagues.findOne().leaderboard[eventIndex + 1].forEach((obj, i) => {
      var user = Meteor.users.findOne(obj.id);
      localBoard[user.username] = obj;
    });
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
          Object.keys(ldrboard).map((user, i) => {
            return (
              <div className="row x-center" style={{marginBottom: 10}}>
                <div className="col-1">
                  { ldrboard[user] }
                </div>
                <div className="col-1">
                  { user }
                </div>
                <div className="col-1">
                  { totalPoints - i  } +
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
                      Meteor.call("leagues.leaderboard.setBonus", Leagues.findOne()._id, eventIndex + 1, localBoard[user].id, parseInt(e.target.value), (err) => {
                        if(err) {
                          toastr.error("Couldn\'t update bonus points!");
                        }
                      })
                      this.state.participants[user] = parseInt(e.target.value);
                    }} defaultValue={localBoard[user].bonus}
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    );
  }

  singleElimLeaderboard() {
    var ldrboard = {};
    var userCount = 1;
    var roundobj = Brackets.findOne();
    var finals = roundobj.rounds[roundobj.rounds.length - 1].pop()[0];
    roundobj.rounds[roundobj.rounds.length - 1].push([finals]);
    var singleElimBracket = roundobj.rounds[roundobj.rounds.length - 1];
    singleElimBracket.reverse().forEach(round => {
      round.forEach(match => {
        if(!match) {
          return;
        }
        match = Matches.findOne(match.id);
        if(match.winner == null) {
          return;
        }
        if(ldrboard[match.winner.alias] == null) {
          ldrboard[match.winner.alias] = userCount ++;
        }
        var loser = match.winner.alias == match.players[0].alias ? match.players[1].alias : match.players[0].alias;
        if(ldrboard[loser] == null) {
          ldrboard[loser] = userCount ++;
        }
      });
    });
    return this.boardFormatting(ldrboard);
  }

  doubleElimLeaderboard() {
    var ldrboard = {};
    var participants = {};
    var userCount = 1;
    var roundobj = Brackets.findOne();
    // Check to see if bracket has played to completion.
    var finalSet = roundobj.rounds[roundobj.rounds.length - 1];
    var finalOne = finalSet[0][0];
    var finalTwo = finalSet[1][0];
    // If the first match has a winner and nobody is playing in the second match, the bracket is decided.
    // If the second match has a winner, the bracket is decided.
    var losersBracket = roundobj.rounds[1];
    losersBracket = losersBracket.concat(finalSet).reverse();
    losersBracket.forEach(round => {
      round.forEach(match => {
        if(!match){
          return;
        }
        match = Matches.findOne(match.id);
        if(match.winner == null) {
          return;
        }
        if(ldrboard[match.winner.alias] == null) {
          ldrboard[match.winner.alias] = userCount ++;
          participants[match.winner.alias] = 0;
        }
        var loser = match.winner.alias == match.players[0].alias ? match.players[1].alias : match.players[0].alias;
        if(ldrboard[loser] == null) {
          ldrboard[loser] = userCount ++;
          participants[loser] = 0;
        }
      })
    });
    this.state.participants = participants;
    return this.boardFormatting(ldrboard);
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
        return this.singleElimLeaderboard();
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
