import React, { Component } from 'react'
import MatchBlock from './match.jsx';

export default class SingleDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  render() {
    return (
      <div className="col">
        <div className="row">
          {
            Array(this.props.rounds[0].length).fill("").map((_, i) => {
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
            this.props.rounds[0].map((round, i) => {
              return (
                <div className="col" style={{justifyContent: "space-around"}}>
                  {
                    round.map((match, j) => {
                      var isFutureLoser = false;
                      if(i < this.props.rounds[0].length - 1){
                        var rNum = i + 1;
                        var nextMatch = this.props.rounds[0][rNum][Math.floor(j / 2)];
                        var mNum = Math.floor(j / 2);
                        while(rNum < this.props.rounds[0].length && nextMatch.winner != null) {
                          if(nextMatch.winner != match.playerOne && nextMatch.winner != match.playerTwo) {
                            isFutureLoser = true;
                            break;
                          }
                          mNum = Math.floor(mNum / 2);
                          rNum += 1;
                          if(rNum == this.props.rounds[0].length) {
                            break;
                          }
                          nextMatch = this.props.rounds[0][rNum][mNum];
                        }
                      }
                      return (
                        <MatchBlock match={match} bracket={0} roundNumber={i} matchNumber={j} roundSize={this.props.rounds[0].length} id={this.state.id} isFutureLoser={isFutureLoser} />
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
