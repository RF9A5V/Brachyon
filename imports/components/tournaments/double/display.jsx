import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class DoubleDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="delim">
        <div className="col">
          <div className="row center">
            <h3 style={{marginBottom: 20}}>Winner's Bracket</h3>
          </div>
          <div className="row">
            { //Winner's bracket block
              Array(this.props.rounds[0].length+2).fill("").map((_, i) => {
                if (i < this.props.rounds[0].length)
                {
                  return (
                    <div key={i} className="round-spacing spacing" style={{textAlign: "center"}}>
                      Round { i + 1 }
                    </div>
                  )
                }
                else if (!((i - this.props.rounds[0].length == 1) && this.props.rounds[2][1][0].playerOne == null))
                {
                  return (
                    <div key={i} className="round-spacing spacing" style={{textAlign: "center"}}>
                      Grand Finals {i + 1 - this.props.rounds[0].length}
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
                          <MatchBlock key={i + " " + j} match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.props.onMatchClick} />
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
                            <MatchBlock key={i + " " + j} match={match} bracket={2} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[2].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.props.onMatchClick}/>
                          );
                        }
                      })
                    }
                  </div>
                );
              })
            }
            </div>
          </div>
        </div>

        <div className="col" style={{marginTop: 50}}>
          <div className="row center">
            <h3 style={{marginBottom: 20}}>Loser's Bracket</h3>
          </div>
          <div className="row">
            { //Loser's bracket block
              Array(this.props.rounds[1].length).fill("").map((_, i) => {
                  if(i == this.props.rounds[1].length-1)
                  {
                    return (
                      <div key={i} className="round-spacing spacing" style={{textAlign: "center"}}>
                        Losers Finals
                      </div>
                    )
                  }
                  else if (i > 0 || this.props.rounds[1][0].length < 2)
                  {
                    i = (this.props.rounds[1][0].length < 2) ? i:i-1;
                    return (
                      <div key={i} className="round-spacing spacing" style={{textAlign: "center"}}>
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
                            <MatchBlock match={match} bracket={1} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[1].length}  isFutureLoser={isFutureLoser} update={this.props.update} onMatchClick={this.props.onMatchClick}/>
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
