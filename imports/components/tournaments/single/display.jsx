import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class SingleDisplay extends Component {
  render() {
    return (
      <div className="col">
        <div className="row">
          {
            Array(this.props.rounds.length).fill("").map((_, i) => {
              return (
                <div style={{width: 150, textAlign: "center"}}>
                  Round { i + 1 }
                </div>
              )
            })
          }
        </div>
        <div className="row">
          {
            this.props.rounds.map((round, i) => {
              return (
                <div className="col" style={{justifyContent: "space-around"}}>
                  {
                    round.map((match, j) => {
                      var isFutureLoser = false;
                      if(i < this.props.rounds.length - 1){
                        var rNum = i + 1;
                        var nextMatch = this.props.rounds[rNum][Math.floor(j / 2)];
                        var mNum = Math.floor(j / 2);
                        while(rNum < this.props.rounds.length && nextMatch.winner != null) {
                          if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                            isFutureLoser = true;
                            break;
                          }
                          mNum = Math.floor(mNum / 2);
                          rNum += 1;
                          if(rNum == this.props.rounds.length) {
                            break;
                          }
                          nextMatch = this.props.rounds[rNum][mNum];
                        }
                      }
                      return (
                        <MatchBlock match={match} roundNumber={i} matchNumber={j} roundSize={this.props.rounds.length} id={this.props.id} isFutureLoser={isFutureLoser} />
                      );
                    })
                  }
                </div>
              );
            })
          }
        </div>
      </div>
    )

  }
}
