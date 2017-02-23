import React, { Component } from 'react';
import Matches from "/imports/api/event/matches.js";

import MatchBlock from './match.jsx';

export default class SingleDisplay extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4>Bracket</h4>
        <div className="submodule-bg col">
          <div className="row">
            {
              Array(this.props.rounds[0].length).fill("").map((_, i) => {
                if(i == this.props.rounds[0].length-1)
                {
                  return (
                    <div className="round-spacing spacing" style={{textAlign: "center"}}>
                      Grand Finals
                    </div>
                  )
                }
                else{
                  return (
                    <div className="round-spacing spacing" style={{textAlign: "center"}}>
                      Round { i + 1 }
                    </div>
                  )
                }
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
                        if(match) {
                          var obj = match;
                          if(match.id) {
                            obj = Matches.findOne(match.id);
                          }
                          if(obj.players[0] && obj.players[1]) {
                            var p1Alias = obj.players[0].alias;
                            var p2Alias = obj.players[1].alias;
                            var matchLosses = Matches.find({
                              $or: [
                                {
                                  "players.alias": p1Alias,
                                  "winner": {
                                    $ne: null
                                  },
                                  "winner.alias": {
                                    $ne: p1Alias
                                  }
                                },
                                {
                                  "players.alias": p2Alias,
                                  "winner": {
                                    $ne: null
                                  },
                                  "winner.alias": {
                                    $ne: p2Alias
                                  }
                                }
                              ]
                            }).fetch();
                            isFutureLoser = matchLosses.length == 2;
                          }
                        }
                        return (
                          <MatchBlock
                            isLast={i == this.props.rounds[0].length - 1}
                            round={i}
                            match={obj}
                            isFutureLoser={isFutureLoser}
                            update={this.props.update}
                            index={j}
                            onMatchClick={this.props.onMatchClick}
                          />
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
    )

  }
}
