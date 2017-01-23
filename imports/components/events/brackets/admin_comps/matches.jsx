import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Brackets from "/imports/api/brackets/brackets.js";

export default class MatchList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sub: Meteor.subscribe("brackets", props.id, {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      open: false,
      filter: "waiting"
    }
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  scoreModalContent() {
    var match = Matches.findOne(this.state.id);
    if(!match) {
      return "";
    }
    var scoreComp = match.players.map((p, i) => {

      var cb = (val) => {
        Meteor.call("events.brackets.updateMatchScore", this.state.id, i == 0, val, () => {
          this.forceUpdate();
        });
      }

      return (
        <div className="col x-center col-1">
          <img src={this.profileImageOrDefault(p.id)} style={{width: 200, height: 200, borderRadius: "100%", marginBottom: 20}} />
          <span style={{fontSize: 20, marginBottom: 20}}>{ p.alias }</span>
          <div className="row x-center">
            <FontAwesome name="caret-left" size="3x" onClick={() => { cb(-1) }} />
            <span style={{fontSize: 24, padding: 10, backgroundColor: "#333", margin: "0 20px"}}>{ p.score }</span>
            <FontAwesome name="caret-right" size="3x" onClick={() => { cb(1) }} />
          </div>
        </div>
      )
    });
    return (
      <div className="col">
        <div className="row" style={{marginBottom: 20}}>
          { scoreComp }
        </div>
        <div className="row center">
          <button style={{marginRight: 10}}>View</button>
          <button onClick={() => {
            var func = this.props.format == "single_elim" ? "events.advance_single" : "events.advance_double";
            Meteor.call(func, Brackets.findOne()._id, this.state.bracket, this.state.round, this.state.match, (err) => {
              if(err) {
                return toastr.error(err.reason);
              }
              else {
                this.setState({ open: false });
              }
            });
          }}>End</button>
        </div>
      </div>
    )
  }

  filterSelect() {
    var options = [
      {
        type: "Waiting",
        value: "waiting"
      },
      {
        type: "Running",
        value: "running",
      },
      {
        type: "Completed",
        value: "completed"
      },
      {
        type: "All",
        value: "all"
      }
    ]
    return (
      <select onChange={(e) => { this.setState({ filter: e.target.value }) }}>
        {
          options.map(o => {
            return (
              <option value={o.value}>{ o.type }</option>
            )
          })
        }
      </select>
    )
  }

  render() {
    if(!this.state.ready) {
      return (
        <div></div>
      )
    }
    var bracket = Brackets.findOne();
    return (
      <div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
          {
            this.scoreModalContent()
          }
        </Modal>
        <div className="row center" style={{marginBottom: 20}}>
          <h5>Pending Matches</h5>
        </div>
        <div className="row" style={{flexWrap: "wrap", marginBottom: 20}}>
          {
            (() => {
              var content = bracket.rounds.map((b, i) => {
                return b.map((r, j) => {
                  return r.map((m, k) => {
                    if(!m || !m.id) {
                      return "";
                    }
                    var match = Matches.findOne(m.id);
                    if(match.players[0] == null || match.players[1] == null || match.winner != null) {
                      return "";
                    }
                    return (
                      <div className="col" style={{marginBottom: 10, width: 400, marginRight: 10}} onClick={() => { this.setState({ id: m.id, open: true, bracket: i, round: j, match: k }) }}>
                        <div className="row flex-pad x-center" style={{backgroundColor: "#666"}}>
                          <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: 100, height: 100}} />
                          <div className="col-1 col x-center" style={{padding: 10}}>
                            <span style={{alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                            <h5 style={{margin: "10px 0"}}>VERSUS</h5>
                            <span style={{alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                          </div>
                          <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: 100, height: 100}} />
                        </div>
                        <span style={{padding: 5, textAlign: "center", backgroundColor: "#111"}}>{(() => {
                          switch(i) {
                            case 0: return "Winner's Bracket";
                            case 1: return "Loser's Bracket";
                            default: return "Grand Finals";
                          }
                        })()}, Round { i == 1 ? j : j + 1}</span>
                      </div>
                    )
                  }).filter(m => { return m != "" });
                }).filter(r => { return r.length != 0 });
              }).filter(b => { return b.length != 0 });
              if(content.length > 0) {
                return content;
              }
              return (
                <div className="row center">
                  No more matches pending. This bracket has finished!
                </div>
              )
            })()

          }
        </div>
        <div className="row center" style={{marginBottom: 20}}>
          <h5>Completed Matches</h5>
        </div>
        {
          bracket.rounds.map((b, i) => {
            var header;
            switch(i) {
              case 0: header = "Winner's Bracket"; break;
              case 1: header = "Loser's Bracket"; break;
              default: header = "Grand Finals";
            }

            return b.map((r, j) => {
              if(i == 1 && j == 0) {
                return "";
              }
              return (
                <div className="accordion-base">
                  <div className="accordion-tab" onClick={() => {
                    if(this.state.bTab == i && this.state.rTab == j) {
                      this.setState({ bTab: null, rTab: null });
                    }
                    else {
                      this.setState({ bTab: i, rTab: j })
                    }
                  }}>
                    <span>
                      {header}, Round {i == 1 ? j : j + 1}
                    </span>
                    <FontAwesome name={this.state.bTab == i && this.state.rTab == j ? "caret-up" : "caret-down"} size="2x" />
                  </div>
                  <div className="accordion-content" style={{display: this.state.bTab == i && this.state.rTab == j ? "inherit" : "none"}}>
                    <div className="row" style={{flexWrap: "wrap"}}>
                    {
                      (() => {
                        var content = r.map((m, k) => {
                          if(!m || !m.id) {
                            return "";
                          }
                          var match = Matches.findOne(m.id);
                          if(!match.winner) {
                            return "";
                          }
                          var winnerIndex = match.players[0].alias == match.winner.alias ? 0 : 1;
                          return (
                            <div className="col" style={{marginBottom: 10, width: 400, marginRight: 10}}>
                              <div className="row flex-pad x-center" style={{backgroundColor: "#666"}}>
                                <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: 100, height: 100}} />
                                <div className="col-1 col x-center" style={{padding: 10}}>
                                  <span style={{alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                                  <h5 style={{margin: "10px 0"}}>VERSUS</h5>
                                  <span style={{alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                                </div>
                                <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: 100, height: 100}} />
                              </div>
                              <div className="row">
                                <span className="col-1" style={{backgroundColor: winnerIndex == 0 ? "#FF6000" : "#111", padding: 5}}>{ winnerIndex == 0 ? "Winner" : "" }</span>
                                <span className="col-1" style={{textAlign: "right", backgroundColor: winnerIndex == 1 ? "#FF6000" : "#111", padding: 5}}>{ winnerIndex == 1 ? "Winner" : "" }</span>
                              </div>
                            </div>
                          )
                        }).filter(m => { return m != "" });
                        if(content.length > 0) {
                          return content;
                        }
                        return "No matches for this round!";
                      })()
                    }
                    </div>
                  </div>
                </div>
              )
            })
          })
        }
      </div>
    )
  }
}
