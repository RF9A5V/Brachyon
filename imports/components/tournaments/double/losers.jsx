import React, { Component } from "react";
import { Element } from "react-scroll";

import EventModal from "../modal.jsx";
import MatchBlock from './match.jsx';

import DragScroll from "react-dragscroll"
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DoubleElimLosersBracket extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      headerTop: 0
    };
  }

  setMatchMap(rounds) {
    var matchMap = {};
    const bracket = {
      rounds
    };
    var count = 1;
    bracket.rounds[0].forEach(r => {
      r.forEach(m => {
        if(m) {
          const losM = bracket.rounds[1][m.losr][m.losm];
          if(!losM) {
            return;
          }
          var losId = losM.id;
          if(matchMap[losId]) {
            matchMap[losId].source.push({
              id: m.id,
              lost: true
            })
          }
          else {
            matchMap[losId] = {
              source: [{
                id: m.id,
                lost: true
              }]
            }
          }
          matchMap[m.id] = {
            number: count++
          }
        }
      })
    })
    bracket.rounds[1].forEach((r, i) => {
      r.forEach((m, j) => {
        if(m) {
          if(i < bracket.rounds[1].length - 1) {
            var advId;
            if(r.length == bracket.rounds[1][i + 1].length) {
              advId = bracket.rounds[1][i + 1][j].id;
            }
            else {
              advId = bracket.rounds[1][i + 1][parseInt(j / 2)].id
            }
            if(matchMap[advId]) {
              matchMap[advId].source.push({
                id: m.id,
                lost: false
              });
            }
            else {
              matchMap[advId] = {
                source: [{
                  id: m.id,
                  lost: false
                }]
              }
            }
          }
          console.log(m.id);
          console.log(matchMap);
          if(matchMap[m.id].number == null) {
            matchMap[m.id].number = count++;
          }
        }
      })
    });
    this.state.matchMap = matchMap;
  }

  onParticipantHover(alias) {
    if(this.props.setLocalValue) {
      this.props.setLocalValue("activeAlias", alias);
    }
    else {
      this.setState({
        activeAlias: alias
      });
    }
  }

  getActiveAlias() {
    return this.props.localValues ? this.props.localValues.activeAlias : this.state.activeAlias;
  }

  toggleModal(id, b, r, i) {
    this.setState({
      id,
      bracket: b,
      round: r,
      match: i,
      open: true
    });
  }

  mainBracket() {
    this.setMatchMap(this.props.rounds);

    return (
      <div className="col" >
        <div className="row">
          {
            this.props.rounds[1].map((round, i) => {
              if (i > 0 || this.props.rounds[1][0].filter((m) => { return m != null }).length > 0)
              {
                  return (
                    <div className="col x-center">
                      <div className="col col-1" style={{justifyContent: "space-around"}} key={i}>
                        {
                          round.map((match, j) => {
                            var isFutureLoser = false;
                            if(match && match.id) {
                              match = Matches.findOne(match.id) || match;
                            }
                            if(match && match.id && match.players[0] != null && match.players[1] != null && i < this.props.rounds[1].length - 1){
                              var nextMatch = i%2==0 ? this.props.rounds[1][i+1][j]:this.props.rounds[1][i + 1][Math.floor(j / 2)];
                              nextMatch = Matches.findOne(nextMatch.id);
                              var rNum = i + 1;
                              var mNum = i%2==0 ? j:Math.floor(j / 2);
                              while(++rNum < this.props.rounds[1].length && nextMatch.winner != null) {
                                if(nextMatch.winner.alias != match.players[0].alias && nextMatch.winner.alias != match.players[1].alias) {
                                  isFutureLoser = true;
                                  break;
                                }
                                mNum = Math.floor(mNum / 2);
                                nextMatch = this.props.rounds[1][rNum][mNum];
                                nextMatch = Matches.findOne(nextMatch.id);
                              }
                            }
                            return (
                              <MatchBlock match={match} bracket={1} roundNumber={i}
                                matchNumber={j} roundSize={this.props.rounds[1].length}
                                isFutureLoser={isFutureLoser} update={this.props.update}
                                onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}
                                matchMap={this.state.matchMap} partMap={this.props.partMap}
                                onParticipantHover={this.onParticipantHover.bind(this)} activeAlias={this.getActiveAlias()}
                              />
                            );
                          })
                        }
                      </div>
                    </div>
                );
              }
            })
          }
        </div>
      </div>
    )
  }

  renderBase(opts) {
    const firstRoundNull = this.props.rounds[1][0].every(m => {
      return m == null;
    });
    const funcFirst = firstRoundNull ? 1 : 0;
    var headers = this.props.rounds[1].map((r, i) => {
      if(i < funcFirst) {
        return null;
      }
      const matchCount = r.filter(m => {
        return m != null;
      }).length;
      var text;
      if(i == this.props.rounds[1].length - 1) {
        text = "Finals";
      }
      else if(i == this.props.rounds[1].length - 2) {
        text = "Semi-Finals";
      }
      else if(i == this.props.rounds[1].length - 3) {
        text = "Quarter-Finals";
      }
      else {
        text = "Round " + (i - funcFirst + 1);
      }
      var width = opts.headerWidth;
      if(i > funcFirst) {
        width += opts.headerSpacing;
        if((i - funcFirst) % 2 == 0) {
          width += opts.headerDiff || 5;
        }
      }
      return (
        <h4 style={{width, display: "inline-block", fontSize: opts.fontSize}}>
          Losers { text }
        </h4>
      )
    });

    const width = opts.headerWidth + ((opts.headerWidth + opts.headerSpacing) * (headers.length - 1));

    return (
      <Element name="losers" onWheel={(e) => {
        e.stopPropagation();
      }}>
        {
          opts.mobile ? (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{position: "relative", paddingTop: 40, height: opts.dragHeight, width: "100%",  overflow: "auto"}} onScroll={(e) => {
              const node = document.getElementById("loser-header");
              this.setState({
                headerTop: e.target.scrollTop
              })
            }} onWheel={(e) => {
              const node = document.getElementById("loser-header");
              this.setState({
                headerTop: e.target.scrollTop
              })
            }}>
              <div style={{width, paddingTop: 40, paddingBottom: 80}}>
                <div style={{
                  backgroundColor: "#222",
                  position: "absolute",
                  zIndex: 1, top: this.state.headerTop, left: 0,
                  width,
                  whiteSpace: "nowrap",
                  maxWidth: "100%"
                }} id="loser-header">
                  { headers }
                </div>
                { this.mainBracket(opts) }
              </div>
            </div>
          ) : (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: this.props.full ? "" : opts.dragHeight, position: "relative", marginBottom: 20}}>
              <div style={{
                backgroundColor: "#222",
                position: "absolute",
                zIndex: 1, top: 0, left: 0,
                width,
                whiteSpace: "nowrap",
                maxWidth: "100%"
              }} id="loser-header">
                { headers }
              </div>
              <DragScroll width={"100%"} height="100%" ref="dragger" onDrag={(dx, dy) => {
                const el = document.getElementById("loser-header");
                el.scrollLeft -= dx;
                if(this.props.full) {
                  window.scrollBy(0, -dy);
                }
              }}>
                <div style={{paddingTop: 40, paddingBottom: this.props.addPadding ? 120 : 0}} ref="content">
                  { this.mainBracket(opts) }
                </div>
              </DragScroll>
            </div>
          )
        }

        {
          this.props.id && !this.props.complete ? (
            <EventModal
              id={this.state.id}
              bracket={this.state.bracket}
              round={this.state.round}
              match={this.state.match}
              open={this.state.open}
              closeModal={() => { this.setState({open: false}) }}
              update={this.props.update}
              format={this.props.format}
            />
          ) : (
            ""
          )
        }
      </Element>
    );
  }

  renderMobile() {
    return this.renderDesktop();
    return this.renderBase({
      dragHeight: "calc(100vh - 252px)",
      headerWidth: 410,
      headerSpacing: 70,
      fontSize: "3em",
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      dragHeight: "calc(97vh - 150px)",
      headerWidth: 240,
      headerSpacing: 20,
      headerDiff: 5,
      fontSize: "1em",
      mobile: false
    });
  }

}
