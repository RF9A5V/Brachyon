import React, { Component } from "react";

import EventModal from "../modal.jsx";
import MatchBlock from './match.jsx';

import DragScroll from "react-dragscroll"
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class DoubleElimLosersBracket extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var matchMap = {};
    const bracket = {
      rounds: props.rounds
    };
    var count = 1;
    bracket.rounds[0].forEach(r => {
      r.forEach(m => {
        if(m) {
          console.log(m);
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
          if(matchMap[m.id].number == null) {
            matchMap[m.id].number = count++;
          }
        }
      })
    });
    this.state = {
      dragging: false,
      matchMap
    };
  }

  onDrag(e) {
    if(this.refs.headers && this.refs.dragger) {
      this.refs.headers.scrollLeft = this.refs.dragger.refs.container.scrollLeft;
      const isDragging = this.refs.dragger.state.dragging;
      if(this.state.dragging != isDragging) {
        this.setState({
          dragging: isDragging
        })
      }
    }
  }

  componentDidMount() {
    const func = this.onDrag.bind(this);
    window.addEventListener("mouseup", func);
    window.addEventListener("mousemove", func);
    this.state.func = func;
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.state.func);
    window.removeEventListener("mousemove", this.state.func);
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
    var hasInactiveFirstRound = this.props.rounds[1].every(m => {
      return m == null;
    })
    if(hasInactiveFirstRound) {
      headers.pop();
    }

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
                              <MatchBlock match={match} bracket={1} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[1].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} matchMap={this.state.matchMap} partMap={this.props.partMap}/>
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

    const firstRoundNull = this.props.rounds[1][1].every(m => {
      return m == null;
    });
    const funcFirst = firstRoundNull ? 1 : 0;
    var headers = this.props.rounds[1].map((r, i) => {
      const matchCount = r.filter(m => {
        return m != null;
      }).length;
      var text;
      if(i == 0) {
        text = "Top " + Object.keys(this.props.partMap).length;
      }
      else if(i == this.props.rounds[1].length - 1) {
        text = "Finals";
      }
      else if(i == this.props.rounds[1].length - 2) {
        text = "Semi-Finals";
      }
      else if(i == this.props.rounds[1].length - 3) {
        text = "Quarter-Finals";
      }
      else {
        text = "Top " + (matchCount * 2)
      }
      return (
        <h4 style={{width: opts.headerWidth + (i == funcFirst ? 0 : opts.headerSpacing), display: "inline-block", fontSize: opts.fontSize}}>
          Losers { text }
        </h4>
      )
    });

    return (
      <div id="losers" onWheel={(e) => {
        e.stopPropagation();
      }}>
        <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: opts.dragHeight, position: "relative"}}>
          <div style={{
            backgroundColor: "#222",
            position: "absolute",
            zIndex: 2, top: 0, left: 0,
            width: opts.headerWidth + (opts.headerWidth + opts.headerSpacing) * (headers.length - 1)
          }} id="loser-header">
            { headers }
          </div>
          <DragScroll width={"100%"} height="100%" ref="dragger" onDrag={(dx, dy) => {
            const node = document.getElementById("loser-header");
            var top = node.style.top;
            top -= dy;
            node.style.top = Math.max(node.style.top, 0);
            node.scrollLeft += dx;
            console.log(node.scrollLeft, dx);
          }}>
            <div style={{marginTop: 40}}>
              { this.mainBracket(opts) }
            </div>
          </DragScroll>
        </div>
        {
          this.props.id && !this.props.complete ? (
            <EventModal
              id={this.state.id}
              bracket={this.state.bracket}
              round={this.state.round}
              match={this.state.match}
              open={this.state.open}
              closeModal={() => { this.setState({open: false}) }}
              update={this.forceUpdate.bind(this)}
              format={this.props.format}
            />
          ) : (
            ""
          )
        }
      </div>
    );
  }

  renderMobile() {
    return this.renderBase({
      dragHeight: "calc(100vh - 252px)",
      headerWidth: 460,
      fontSize: "3em",
      mobile: true
    });
  }

  renderDesktop() {
    return this.renderBase({
      dragHeight: "calc(97vh - 150px)",
      headerWidth: 245,
      headerSpacing: 15,
      fontSize: "1em",
      mobile: false
    });
  }

}
