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
    var leaderboard = Leagues.findOne().leaderboard[eventIndex];
    var getSuffix = (place) => {
      switch(place % 10) {
        case 1: return "st";
        case 2: return "nd";
        case 3: return "rd";
        default: return "th";
      }
    }
    var currentPlace = 1;
    return (
      <div style={{maxHeight: 300, overflowY: "auto"}}>
        <div className="row">
          <div className="col-2">
            Position
          </div>
          <div className="col-1">
            Points
          </div>
          <div className="col-1">
            Bonus
          </div>
        </div>
        {
          ldrboard.map((users, i) => {
            var place = currentPlace;
            currentPlace += users.length;
            var nextPlace = currentPlace - 1;
            return (
              <div className="row x-center" style={{marginBottom: 10}}>
                <div className="col-2">
                  { place + getSuffix(place) }{ place != nextPlace ? ` - ${nextPlace + getSuffix(nextPlace)}` : "" }
                </div>
                <div className="col-1">
                  { participantCount - i } +
                </div>
                <div className="col-1">
                  <input type="number" style={{width: "100%", margin: 0, fontSize: 12}} defaultValue={leaderboard[users[0].id].bonus} onBlur={(e) => {
                    var value = parseInt(e.target.value);
                    if(isNaN(value)) {
                      e.target.value = 0;
                      return;
                    }
                    Meteor.call("leagues.leaderboard.setBonusByPlacement", Leagues.findOne()._id, eventIndex, parseInt(e.target.value), i, (err) => {
                      if(err) {
                        toastr.error(err.reason);
                      }
                    })
                  }} onKeyPress={(e) => { if(e.key == "Enter") e.target.blur() }} />
                </div>
              </div>
            )
            // return users.map(user => {
            //   return (
            //     <div className="row x-center" style={{marginBottom: 10}}>
            //       <div className="col-1">
            //         { i + 1 }
            //       </div>
            //       <div className="col-1">
            //         { user.alias }
            //       </div>
            //       <div className="col-1">
            //         { participantCount - i  } +
            //       </div>
            //       <div className="col-1">
            //         <input type="text" style={{width: "100%", margin: 0, fontSize: 12}} onChange={(e) => {
            //           if(isNaN(e.target.value)) {
            //             e.target.value = e.target.value.slice(0, e.target.value.length - 1)
            //           } else {
            //             this.forceUpdate();
            //           } }} onKeyPress={(e) => {
            //             if(e.key == "Enter") {
            //               e.target.blur();
            //             }
            //           }} onBlur={(e) => {
            //             Meteor.call("leagues.leaderboard.setBonus", Leagues.findOne()._id, eventIndex, user.id, parseInt(e.target.value), (err) => {
            //               if(err) {
            //                 toastr.error("Couldn\'t update bonus points!");
            //               }
            //             })
            //           }} defaultValue={leaderboard[user.id].bonus}
            //         />
            //       </div>
            //     </div>
            //   )
            // })
          })
        }
      </div>
    );
  }

  singleElimLeaderboard() {
    var rounds = Brackets.findOne().rounds;
    var placement = [];
    var finals = Matches.findOne(rounds[0].pop()[0].id);
    placement.push([finals.winner]);
    placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]])
    rounds[0].reverse().map(r => {
      var losers = [];
      r.map(m => Matches.findOne((m || {}).id)).forEach(m => {
        if(!m) return;
        losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
      });
      placement.push(losers);
    });
    return this.boardFormatting(placement);
  }

  doubleElimLeaderboard() {
    var roundobj = Brackets.findOne();

    var placement = [];
    var rounds = roundobj.rounds;
    var finals = rounds[2].map(m => {return Matches.findOne(m[0].id)});
    finals = finals[1] && finals[1].winner != null ? finals[1] : finals[0];
    placement.push([finals.winner]);
    placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]]);
    rounds[1].reverse().forEach(round => {
      var losers = [];
      round.map(m => Matches.findOne((m || {}).id)).forEach(m => {
        if(!m) return;
        losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
      });
      if(losers.length > 0) {
        placement.push(losers);
      }
    });
    return this.boardFormatting(placement);
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
    var league = Leagues.findOne();
    if(league.owner != Meteor.userId()) {
      return null;
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
