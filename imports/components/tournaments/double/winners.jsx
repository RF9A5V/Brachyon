import React, { Component } from "react";

import MatchBlock from './match.jsx';
import EventModal from "../modal.jsx";

export default class DoubleElimWinnersBracket extends Component {

  constructor(props) {
    super(props);
    this.state = {};
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

  finals() {
    return (
      <div className="row">
        {
          this.props.rounds[2].map((round, i) => {
            var finr = "finalround" + i
            return (
              <div className="col finalr" id={finr} style={{justifyContent: "space-around"}} key={i}>
                {
                  round.map((match, j) => {
                    if(match.id) {
                      match = Matches.findOne(match.id);
                    }
                    if(!match || match.players[0] == null || match.players[1] == null) {
                      return "";
                    }
                    if (match.players[0].alias != null && match.players[1] != null)
                    {
                      var isFutureLoser = false;
                      // if(i < this.props.rounds[2].length - 1){
                      //   var nextMatch = this.props.rounds[2][i + 1][Math.floor(j / 2)];
                      //   var rNum = i + 1;
                      //   var mNum = Math.floor(j / 2);
                      //   while(++rNum < this.props.rounds[2].length && nextMatch.winner != null) {
                      //     if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                      //       isFutureLoser = true;
                      //       break;
                      //     }
                      //     mNum = Math.floor(mNum / 2);
                      //     nextMatch = this.props.rounds[2][rNum][mNum];
                      //   }
                      // }
                      return (
                        <MatchBlock key={i + " " + j} match={match} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds}/>
                      );
                    }
                  })
                }
              </div>
            );
          })
        }
      </div>
    )
  }

  mainBracket() {
    return (
      <div className="row">
        <div className="row">
        {
          this.props.rounds[0].map((round, i) => {
            return (
              <div className="col" style={{justifyContent: "space-around"}} key={i}>
                {
                  round.map((match, j) => {
                    var isFutureLoser = false;
                    if(match && match.id) {
                      match = Matches.findOne(match.id);
                    }
                    if(match && match.id && match.players[0] != null && match.players[1] != null && i < this.props.rounds[0].length - 1){
                      var nextMatch = this.props.rounds[0][i + 1][Math.floor(j / 2)];
                      nextMatch = Matches.findOne(nextMatch.id);
                      var rNum = i + 1;
                      var mNum = Math.floor(j / 2);
                      while(++rNum < this.props.rounds[0].length && nextMatch.winner != null) {
                        if(nextMatch.winner.alias != match.players[0].alias && nextMatch.winner.alias != match.players[1].alias) {
                          isFutureLoser = true;
                          break;
                        }
                        mNum = Math.floor(mNum / 2);
                        nextMatch = this.props.rounds[0][rNum][mNum];
                        nextMatch = Matches.findOne(nextMatch.id);
                      }
                    }
                    return (
                      <MatchBlock key={i + " " + j} match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.toggleModal.bind(this)} rounds={this.props.rounds} />
                    );
                  })
                }
              </div>
            );
          })
        }
        </div>
        {
          this.props.format == "double_elim" ? (
            this.finals()
          ) : (
            ""
          )
        }
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4 style={{marginTop: 0}}>Winner Bracket</h4>
        <div className="submodule-bg">
          { this.mainBracket() }
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
      </div>
    );
  }
}
