import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Matches from "/imports/api/event/matches.js";

export default class MatchBlock extends Component {
  bracketLines() {
    var i = this.props.roundNumber;
    var j = this.props.matchNumber;
    i = this.props.bracket ? Math.floor(i/2):i;

    var matchComp = (50 * (Math.pow(2, i - 1)));
    var marginComp = (60 * (Math.pow(2, i)));
    var totHeight = matchComp + marginComp;

    var height = totHeight;
    var top = totHeight / 2 + 10;
    if(j % 2 == 0) {
      top -= (7.5 * (Math.pow(2, i) + 1)) + (10 * Math.pow(2, i));
    }
    else {
      if(i == 1) {
        top += 2.5;
      }
      else if(i > 1) {
        top += (Math.pow(2, i - 1) + Math.pow(2, i - 2) - 1) * 10 + 2.5
      }
      top += Math.pow(2, i) * 10;
    }
    return { height, top }
  }

  render() {
    var match = this.props.match;
    var emptyWinnersMatch = (this.props.bracket == 0 && !match);
    var [i, j] = [this.props.roundNumber, this.props.matchNumber];
    var k = this.props.bracket ? Math.floor(i/2):i;

    var height = 35;
    var margin = 10;

    var lineHeight = 5;

    var blockHeight = height * 2 + margin * 2 + lineHeight;
    var blockMargin = 20;

    var vLineBase = blockHeight + blockMargin;
    var vLineHeight = Math.pow(2, i - 1) * vLineBase + lineHeight;
    if(this.props.bracket == 1) {
      vLineHeight = Math.pow(2, parseInt(i / 2) - 1) * vLineBase + lineHeight
    }

    var participantWidth = 200;

    if(!match) {
      return (
        <div style={{height: blockHeight, marginBottom: blockMargin}}>
        </div>
      );
      return (
        <div style={{height: blockHeight, marginBottom: blockMargin}}>
        </div>
      );
    }

    var p1 = (match.players[0] || {});
    var p2 = (match.players[1] || {});

    var isLoser = (p) => {
      return match.winner && p.alias != match.winner.alias;
    }

    return (
      <div className="row x-center" style={{marginBottom: blockMargin}}>
        {
          match.players[0] == null && match.players[1] == null && i == 0 ? (
            <div style={{height: blockHeight}}>
            </div>
          ) : (
            [
              <div className="match" onClick={() => {
                this.props.onMatchClick(match._id, this.props.bracket, this.props.roundNumber, this.props.matchNumber)
              }}>
                <div className="participant" style={{height, marginBottom: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1}}>
                  <div className={((p1.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p1.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p1.score || 0 }
                  </div>
                </div>
                <div style={{width: participantWidth + 20, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
                </div>
                <div className="participant" style={{height, marginTop: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1}}>
                  <div className={((p2.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p2.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p2.score || 0 }
                  </div>
                </div>

              </div>,
              (this.props.roundNumber == this.props.roundSize - 1) || (this.props.bracket == 1 && this.props.roundNumber % 2 == 0) || this.props.bracket == 2 ? (
                ""
              ) : (
                <div style={{
                  width: lineHeight,
                  height: vLineHeight,
                  backgroundColor: this.props.isFutureLoser ? "#999" : "white",
                  position: "relative",
                  zIndex: this.props.isFutureLoser ? 0 : 1,
                  top: ((vLineHeight / 2 - lineHeight / 2) * (j % 2 == 0 ? 1 : -1))
                }}>
                </div>
              )
            ]
          )
        }
      </div>
    )

    return (
      <div className="match-block col center spacing" style={{height: 50 * Math.pow(2, k)}}>
        <div className="match-highlight">
          {
            (match.players[0] == match.players[1] && i == 0 && this.props.bracket == 0) ? (
              ""
            ) : (
              match.players.map((p, index) => {

                var isLoser = match.winner != null && match.winner.alias != p.alias;

                return (
                  <div key={index} className={match.winner == null && match.players[0] != null && match.players[1] != null ? ("match-participant match-active"):("match-participant")} onClick={
                    match.players[0] != null && match.players[1] != null ? (
                      () => {if(Meteor.user()){this.setState({open: true});} }
                    ) : (
                      () => {}
                    )
                  } style={{borderColor: this.props.isFutureLoser ? ("#999") : ("white")}}>
                    <span>
                      <div style={{color: isLoser || this.props.isFutureLoser ? "#999" : "white"}} className={p==null? (""): (this.getUsername(p).length < 19? "" : "marquee")} ref="matchOne">
                        {
                          this.getUsername(p)
                        }
                      </div>
                    </span>
                  </div>
                )
              })
            )
          }
        </div>
        {
          i == this.props.roundSize - 1 || (match.players[0] == match.players[1] && i == 0) || (this.props.bracket == 1 && (i%2 == 0)) || this.props.bracket == 2 ? (
            ""
          ) : (
            j % 2 == 0 ? (
              <div className="bracket-line-v" style={{height: this.bracketLines().height, top: this.bracketLines().top, left: 165, backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>
            ) : (
              <div className="bracket-line-v" style={{height: this.bracketLines().height, top: -this.bracketLines().top , left: 165 ,backgroundColor: this.props.isFutureLoser ? ("#999") : ("white"), zIndex: this.props.isFutureLoser ? 0 : 1 }}></div>
            )

          )
        }
      </div>
    )
  }
}
