import React, { Component } from "react";

import EventModal from "../modal.jsx";
import MatchBlock from './match.jsx';

import DragScroll from "react-dragscroll"

export default class DoubleElimLosersBracket extends Component {

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
          var losId = bracket.rounds[1][m.losr][m.losm].id;
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
        <div className="row" style={{paddingLeft: 10}}>
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
                              match = Matches.findOne((match || {}).id)
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

  render() {

    if (this.props.rounds[1][0].filter((m) => { return m != null }).length == 0){
      var headers = this.props.rounds[1].map((_, i) => {
        return (
          <h4 style={{width: i == 0 ? 225 : 245, display: "inline-block"}}>
            Round { i + 1 }
          </h4>
        )
      });
    }
    else {
      var headers = this.props.rounds[1].map((_, i) => {
        return (
          <h4 style={{width: i == 0 ? 225 : 245, display: "inline-block"}}>
            Round { i + 1 }
          </h4>
        )
      });
    }

    return (
      <div onWheel={(e) => {
        e.stopPropagation();
      }}>
        <div style={{overflowX: "hidden", margin: -20, marginBottom: 10, whiteSpace: "nowrap", backgroundColor: "#222", width: "calc(100% + 40px)"}} ref="headers">
          { headers }
        </div>
        {
          this.props.page == "admin" ? (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: "calc(97vh - 300px)", margin: -20, marginTop: 0}}>
              <DragScroll width={"100%"} height={"100%"} ref="dragger">
                { this.mainBracket() }
              </DragScroll>
            </div>
          ) : (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: "calc(97vh - 300px)"}}>
              <DragScroll width="100%" height="100%" ref="dragger">
                { this.mainBracket() }
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
}
