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
                      return (
                        <MatchBlock match={match} roundNumber={i} matchNumber={j} roundSize={this.props.rounds.length} id={this.props.id} />
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
