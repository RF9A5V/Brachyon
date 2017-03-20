import React, { Component } from "react";

import EventModal from "../modal.jsx";
import MatchBlock from './match.jsx';

import DragScroll from "react-dragscroll"

export default class DoubleElimLosersBracket extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dragging: false
    };
  }

  onDrag(e) {
    this.refs.headers.scrollLeft = this.refs.dragger.refs.container.scrollLeft;
    const isDragging = this.refs.dragger.state.dragging;
    if(this.state.dragging != isDragging) {
      this.setState({
        dragging: isDragging
      })
    }
  }

  componentDidMount() {
    window.addEventListener("mouseup", this.onDrag.bind(this));
    window.addEventListener("mousemove", this.onDrag.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener("mouseup", this.onDrag.bind(this));
    window.removeEventListener("mousemove", this.onDrag.bind(this));
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
                              <MatchBlock match={match} bracket={1} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[1].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}/>
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
          <h4 style={{marginBottom: 20, width: i == 0 ? 225 : 245, display: "inline-block"}}>
            Round { i }
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
      <div style={{height: "100%"}}>
        <div style={{overflowX: "hidden", margin: -20, marginBottom: 10, whiteSpace: "nowrap", backgroundColor: "#222", width: "calc(100% + 40px)"}} ref="headers">
          { headers }
        </div>
        {
          this.props.page == "admin" ? (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: "50vh", margin: -20, marginTop: 0}}>
              <DragScroll width={"100%"} height={"100%"} ref="dragger">
                { this.mainBracket() }
              </DragScroll>
            </div>
          ) : (
            <div className={this.state.dragging ? "grabbing" : "grab"} style={{height: "70vh"}}>
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
