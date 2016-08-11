import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class DoubleDisplay extends Component {
  render() {
    return (
      <div classname="delim">
        <div className="col">
          <div className="row">
            { //Winner's bracket block
              Array(this.props.rounds[0].length+2).fill("").map((_, i) => {
                if (i < this.props.rounds[0].length)
                {
                  return (
                    <div style={{width: 150, textAlign: "center"}}>
                      Round { i + 1 }
                    </div>
                  )
                }
                else
                {
                  return (
                    <div style={{width: 150, textAlign: "center"}}>
                      Final Round {i + 1 - this.props.rounds[0].length}
                    </div>
                  )
                }
              })
            }
          </div>
          <div className="row">
            <div className="row">
            {
              this.props.rounds[0].map((round, i) => {
                return (
                  <div className="col" style={{justifyContent: "space-around"}}>
                    {
                      round.map((match, j) => {
                        var isFutureLoser = false;
                        if(i < this.props.rounds[0].length - 1){
                          var nextMatch = this.props.rounds[0][i + 1][Math.floor(j / 2)];
                          var rNum = i + 1;
                          var mNum = Math.floor(j / 2);
                          while(++rNum < this.props.rounds[0].length && nextMatch.winner != null) {
                            if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                              isFutureLoser = true;
                              break;
                            }
                            mNum = Math.floor(mNum / 2);
                            nextMatch = this.props.rounds[0][rNum][mNum];
                          }
                        }
                        return (
                          <MatchBlock match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length} id={this.props.id} isFutureLoser={isFutureLoser} />
                        );
                      })
                    }
                  </div>
                );
              })
            }
            </div>
            <div className="row">
            {
              this.props.rounds[2].map((round, i) => {
                return (
                  <div className="col" style={{justifyContent: "space-around"}}>
                    {
                      round.map((match, j) => {
                        var isFutureLoser = false;
                        if(i < this.props.rounds[2].length - 1){
                          var nextMatch = this.props.rounds[2][i + 1][Math.floor(j / 2)];
                          var rNum = i + 1;
                          var mNum = Math.floor(j / 2);
                          while(++rNum < this.props.rounds[2].length && nextMatch.winner != null) {
                            if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                              isFutureLoser = true;
                              break;
                            }
                            mNum = Math.floor(mNum / 2);
                            nextMatch = this.props.rounds[2][rNum][mNum];
                          }
                        }
                        return (
                          <MatchBlock match={match} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length} id={this.props.id} isFutureLoser={isFutureLoser} />
                        );
                      })
                    }
                  </div>
                );
              })
            }
            </div>
          </div>
        </div>

        <div className="col">
          <div className="row">
            { //Loser's bracket block
              Array(this.props.rounds[1].length).fill("").map((_, i) => {
                  if (i > 0 || this.props.rounds[1][0][1].truebye)
                  {
                    i = this.props.rounds[1][0][1].truebye ? i:i-1;
                    return (
                      <div style={{width: 150, textAlign: "center"}}>
                        Round { i + 1 }
                      </div>
                    )
                  }
              })
            }
          </div>
          <div className="row">
            {
              this.props.rounds[1].map((round, i) => {
                if (i > 0 || this.props.rounds[1][0][1].truebye)
                {
                    return (
                    <div className="col" style={{justifyContent: "space-around"}}>
                      {
                        round.map((match, j) => {
                          var isFutureLoser = false;
                          if(i < this.props.rounds[1].length - 1){
                            var nextMatch = i%2==0 ? this.props.rounds[1][i+1][j]:this.props.rounds[1][i + 1][Math.floor(j / 2)];
                            var rNum = i + 1;
                            var mNum = i%2==0 ? j:Math.floor(j / 2);
                            while(++rNum < this.props.rounds[1].length && nextMatch.winner != null) {
                              if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                                isFutureLoser = true;
                                break;
                              }
                              mNum = Math.floor(mNum / 2);
                              nextMatch = this.props.rounds[1][rNum][mNum];
                            }
                          }
                          return (
                            <MatchBlock match={match} bracket={1} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[1].length} id={this.props.id} isFutureLoser={isFutureLoser} />
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
      </div>
    )

  }
}
