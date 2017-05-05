import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Brackets from "/imports/api/brackets/brackets.js";

import ScoreModal from "/imports/components/tournaments/modal.jsx";
import Timer from "/imports/components/public/timer.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import Match from "/imports/components/tournaments/match.jsx";

export default class MatchList extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  profileImageOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  getMatchCount(status, isStream) {
    const bracket = Brackets.findOne();
    var query = {
      stream: isStream
    };
    if(status >= 0) {
      query.status = status;
    }
    var matchCount = Matches.find(query).fetch().length;
    if(bracket.rounds[2]) {
      const finId = bracket.rounds[2][1][0].id;
      const m = Matches.findOne(finId);
      const hasTiebreaker = m.players.some(p => {
        return p && p.alias
      });
      if(!hasTiebreaker && m.status == status) {
        matchCount--;
      }
    }
    return matchCount;
  }

  renderBase(opts) {
    var bracket = Brackets.findOne();
    const textStyle = {
      fontSize: opts.fontSize
    }
    return (
      <div>
        <ScoreModal open={this.state.open} closeModal={() => { this.setState({ open: false }) }} id={this.state.id} format={this.props.format}
         update={this.forceUpdate.bind(this)} bracket={this.state.bIndex} round={this.state.rIndex} match={this.state.mIndex} />
        <div className="row center" style={{marginBottom: 10, padding: `0 ${opts.mobile ? 0 : "25%"}`}}>
          {
            (() => {
              var matchCounts = [];
              for(var i = 0; i < 4; i ++) {
                matchCounts.push(this.getMatchCount(i, false));
              }
              return ["Waiting", "Ready", "Playing", "Complete"].map((t, i) => {
                return (
                  <div className="col col-1" style={{marginRight: i == 3 ? 0 : 10}}>
                    <label className="input-label" style={textStyle}>{ t }</label>
                    <div className="row center x-center" style={{padding: 10, backgroundColor: "#666"}}>
                      <span style={textStyle}>{ matchCounts[i] }</span>
                    </div>
                  </div>
                )
              })
            })()
          }
        </div>
        <div className="row center" style={{marginBottom: 10, padding: `0 25%`}}>
          {
            (() => {
              var matchCounts = [];
              for(var i = 1; i < 3; i ++) {
                matchCounts.push(this.getMatchCount(i, true));
              }
              return ["On Deck", "Streaming"].map((t, i) => {
                return (
                  <div className="col col-1" style={{marginRight: i == 1 ? 0 : 10}}>
                    <label className="input-label" style={textStyle}>{ t }</label>
                    <div className="row center x-center" style={{padding: 10, backgroundColor: "#666"}}>
                      <span style={textStyle}>{ matchCounts[i] }</span>
                    </div>
                  </div>
                )
              })
            })()
          }
        </div>
        <hr className="user-divider" />
        <div className="row center" style={{marginBottom: 20}}>
          <h5 style={textStyle}>Pending Matches</h5>
        </div>
        <div className="row" style={{flexWrap: "wrap", marginBottom: 20}}>
          {
            bracket.rounds.map((b, i) => {
              return b.map((r, j) => {
                const matchesInRound = r.map((m, k) => {
                  if(m){
                    var match = Matches.findOne({
                      _id: m.id,
                      players: {
                        $ne: null
                      },
                      winner: {
                        $eq: null
                      }
                    });
                    if(match && match.players.every(p => { return p })) {
                      match.k = k;
                      return match;
                    }
                  }
                  return null;
                }).filter((m) => {
                  return m
                });
                return matchesInRound.map(match => {
                  var header = (() => {
                    switch(i) {
                      case 0: return "Winner's Bracket";
                      case 1: return "Loser's Bracket";
                      default: return "Grand Finals";
                    }
                  })() + ", " + (() => {
                    var roundNum = (i == 1 && bracket.rounds[1][0].filter((m) => { return m != null }).length == 0 ? j : (j + 1));
                    switch(b.length - roundNum) {
                      case 2: return "Quarter Finals";
                      case 1: return "Semi Finals";
                      case 0: return "Finals";
                      default: return "Round " + roundNum;
                    }
                  })();

                  var status = "Status: " + (() => {
                    switch(match.status) {
                      case 0: return "Waiting"
                      case 1: return match.stream ? "On Deck" : "Ready"
                      case 2: return match.stream ? "Streaming" : "Playing"
                      case 3: return "Complete"
                    }
                  })();

                  var footer = [
                    <span>{status}</span>,
                    <Timer date={match.status == 1 ? match.establishedAt : match.startedAt} />
                  ]

                  var players = match.players.map(p => {
                    p.seed = this.props.partMap[p.alias];
                    return p;
                  })
                  return (
                    <Match id={match._id} players={players} header={header} footer={footer} onClick={() => {
                      this.setState({
                        open: true,
                        id: match._id,
                        bIndex: i,
                        rIndex: j,
                        mIndex: match.k
                      })
                    }} />
                  )
                });
              })
            })
          }
        </div>
        <div className="row center" style={{marginBottom: 20}}>
          <h5 style={textStyle}>Completed Matches</h5>
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
              const matchesInRound = r.map((m, k) => {
                if(m){
                  var match = Matches.findOne({
                    _id: m.id,
                    winner: {
                      $ne: null
                    }
                  });
                  if(match && match.players.every(p => { return p })) {
                    match.k = k;
                    return match;
                  }
                }
                return null;
              }).filter((m) => {
                return m
              });
              if(!matchesInRound.length) {
                return null;
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
                    <span style={textStyle}>
                      {header}, {(() => {
                        var roundNum = j + 1;
                        switch(b.length - roundNum) {
                          case 2: return "Quarter Finals";
                          case 1: return "Semi Finals";
                          case 0: return "Finals";
                          default: return "Round " + roundNum;
                        }
                      })()}
                    </span>
                    <FontAwesome name={this.state.bTab == i && this.state.rTab == j ? "caret-up" : "caret-down"} style={{fontSize: `calc(${opts.fontSize} * 2)`}} />
                  </div>
                  <div className="accordion-content" style={{display: this.state.bTab == i && this.state.rTab == j ? "inherit" : "none"}}>
                    <div className="row" style={{flexWrap: "wrap"}}>
                    {
                      matchesInRound.map(match => {
                        var header = (() => {
                          switch(i) {
                            case 0: return "Winner's Bracket";
                            case 1: return "Loser's Bracket";
                            default: return "Grand Finals";
                          }
                        })() + ", " + (() => {
                          var roundNum = (i == 1 && bracket.rounds[1][0].filter((m) => { return m != null }).length == 0 ? j : (j + 1));
                          switch(b.length - roundNum) {
                            case 2: return "Quarter Finals";
                            case 1: return "Semi Finals";
                            case 0: return "Finals";
                            default: return "Round " + roundNum;
                          }
                        })();

                        var status = "Status: " + (() => {
                          switch(match.status) {
                            case 0: return "Waiting"
                            case 1: return match.stream ? "On Deck" : "Ready"
                            case 2: return match.stream ? "Streaming" : "Playing"
                            case 3: return "Complete"
                          }
                        })();

                        var footer = [
                          <span>{status}</span>,
                          <span>Done!</span>
                        ]

                        var players = match.players.map(p => {
                          p.seed = this.props.partMap[p.alias];
                          return p;
                        })
                        return (
                          <Match id={match._id} players={players} header={header} footer={footer} onClick={() => {
                            this.setState({
                              open: true,
                              id: match._id,
                              bIndex: i,
                              rIndex: j,
                              mIndex: match.k
                            })
                          }} />
                        )
                      })
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

  renderMobile() {
    return this.renderBase({
      fontSize: "2.5em",
      width: "100%",
      imgDim: 200,
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      fontSize: "1em",
      width: 400,
      imgDim: 100,
      mobile: false
    });
  }

}
