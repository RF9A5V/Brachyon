import React, { Component } from "react";

import EventModal from "../modal.jsx";
import MatchBlock from './match.jsx';

export default class DoubleElimLosersBracket extends Component {

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

  mainBracket() {

    var headers = this.props.rounds[1].map((_, i) => {
      return (
        <h4 style={{width: i == 0 ? 220 : 235, marginRight: 10}}>
          Round { i + 1 }
        </h4>
      )
    });
    var hasInactiveFirstRound = this.props.rounds[1].every(m => {
      return m == null;
    })
    if(hasInactiveFirstRound) {
      headers.pop();
    }

    return (
      <div className="col" style={{overflowX: "auto"}}>
        <div className="row" style={{marginBottom: 20}}>
          { headers }
        </div>
        <div className="row" style={{paddingLeft: 10}}>
          {
            this.props.rounds[1].map((round, i) => {
              if (i > 0 || this.props.rounds[1][0].filter((m) => { return m != null }).length > 0)
              {
                  return (
                  <div className="col" style={{justifyContent: "space-around"}} key={i}>
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
                );
              }
            })
          }
        </div>
      </div>
    )
  }

  render() {
    return (
      <div>
        <h4 style={{marginTop: 0}}>Loser Bracket</h4>
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
