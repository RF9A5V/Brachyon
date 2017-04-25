import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Brackets from "/imports/api/brackets/brackets.js";

import ScoreModal from "/imports/components/tournaments/modal.jsx";
import Timer from "/imports/components/public/timer.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

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
                      <div className="col" style={{margin: "20px 10px 20px 0", width: opts.width, cursor: "pointer"}} onClick={() => { this.setState({
                        id: m.id, open: true,
                        bIndex: i, rIndex: j, mIndex: k
                      }) }}>
                        <div style={{padding: 5, backgroundColor: "#111"}}>
                          <span style={{...textStyle, textAlign: "center"}}>{(() => {
                            switch(i) {
                              case 0: return "Winner's Bracket";
                              case 1: return "Loser's Bracket";
                              default: return "Grand Finals";
                            }
                          })()}, {(() => {
                            var roundNum = (i == 1 && bracket.rounds[1][0].filter((m) => { return m != null }).length == 0 ? j : (j + 1));
                            switch(b.length - roundNum) {
                              case 2: return "Quarter Finals";
                              case 1: return "Semi Finals";
                              case 0: return "Finals";
                              default: return "Round " + roundNum;
                            }
                          })()}</span>
                        </div>
                        <div className="row flex-pad x-center" style={{backgroundColor: "#666", position: "relative"}}>
                          <div className="row match-names" style={{top: 0}}>
                            <span style={textStyle}>
                              <sup className="match-seed">
                              [ { this.props.partMap[match.players[0].alias] } ]
                              </sup>
                              { match.players[0].alias }
                            </span>
                          </div>
                          <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
                          <div className="col-1 col x-center" style={{padding: 10}}>
                            <h5 style={{...textStyle, margin: "10px 0"}}>VERSUS</h5>
                          </div>
                          <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
                          <div className="row match-names justify-end" style={{bottom: 0}}>
                            <span style={textStyle}>
                              { match.players[1].alias }
                              <sub className="match-seed">
                                [ { this.props.partMap[match.players[1].alias] } ]
                              </sub>
                            </span>
                          </div>
                        </div>
                        <div className="col" style={{padding: 5, backgroundColor: "#111"}}>

                          <div className="row flex-pad">
                            <span style={textStyle}>Status: {(() => {
                              switch(match.status) {
                                case 0: return "Waiting"
                                case 1: return match.stream ? "On Deck" : "Ready"
                                case 2: return match.stream ? "Streaming" : "Playing"
                                case 3: return "Complete"
                              }
                            })()}</span>
                            <span style={textStyle}>
                              <Timer date={match.status == 1 ? match.establishedAt : match.startedAt} />
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }).filter(m => { return m != "" });
                }).filter(r => { return r.length != 0 });
              }).filter(b => { return b.length != 0 });
              if(content.length > 0) {
                return content;
              }
              return (
                <div className="row center" style={textStyle}>
                  No more matches pending. This bracket has finished!
                </div>
              )
            })()

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
                            <div className="col" style={{marginBottom: 10, width: opts.width, marginRight: 10}}>
                              <div className="row flex-pad x-center" style={{backgroundColor: "#666"}}>
                                <img src={this.profileImageOrDefault(match.players[0].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
                                <div className="col-1 col x-center" style={{padding: 10}}>
                                  <span style={{...textStyle, alignSelf: "flex-start"}}>{ match.players[0].alias }</span>
                                  <h5 style={{...textStyle, margin: "10px 0"}}>VERSUS</h5>
                                  <span style={{...textStyle, alignSelf: "flex-end"}}>{ match.players[1].alias }</span>
                                </div>
                                <img src={this.profileImageOrDefault(match.players[1].id)} style={{width: opts.imgDim, height: opts.imgDim}} />
                              </div>
                              <div className="row">
                                <span className="col-1" style={{...textStyle, backgroundColor: winnerIndex == 0 ? "#FF6000" : "#111", padding: 5}}>{ winnerIndex == 0 ? "Winner" : "" }</span>
                                <span className="col-1" style={{...textStyle, textAlign: "right", backgroundColor: winnerIndex == 1 ? "#FF6000" : "#111", padding: 5}}>{ winnerIndex == 1 ? "Winner" : "" }</span>
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
