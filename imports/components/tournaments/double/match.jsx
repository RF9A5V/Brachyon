import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import Participant from "./participant.jsx";
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Matches from "/imports/api/event/matches.js";

class MatchBlock extends Component {
  bracketLines() {
    var i = this.props.roundNumber;
    var j = this.props.matchNumber;
    i = this.props.bracket ? Math.floor(i/2):i;

    var matchComp = (50 * (Math.pow(2, i - 1)));
    var marginComp = (20 * (Math.pow(2, i)));
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

  participant(p, s) {
    return (
      <div className="participant" style={s}>
        <div className={((p.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
          { p.alias || "TBD" }
        </div>
        <div className="score">
          { p.score || 0 }
        </div>
      </div>
    )
  }

  render() {
    var match = this.props.match;
    var emptyWinnersMatch = (this.props.bracket == 0 && !match);
    var [i, j] = [this.props.roundNumber, this.props.matchNumber];
    var k = this.props.bracket ? Math.floor(i/2):i;

    var height = 35;
    var margin = 0;

    var lineHeight = 5;

    var blockHeight = height * 2 + margin * 2 + lineHeight;
    var blockMargin = 20;

    var vLineBase = blockHeight + blockMargin;
    var vLineHeight = Math.pow(2, i - 1) * vLineBase + lineHeight;
    if(this.props.bracket == 1) {
      vLineHeight = Math.pow(2, parseInt(i / 2) - 1) * vLineBase + lineHeight
    }

    var participantWidth = 200;

    if(!match || (match.players[0] == null && match.players[1] == null && this.props.roundNumber == 0 && this.props.bracket == 0)) {
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

    var bracket = this.props.rounds[this.props.bracket][i - 1];

    var prevMatchesNull;
    if(this.props.bracket == 0) {
      prevMatchesNull = i == 0 || (i == 1 && bracket[j * 2] == null && bracket[j * 2 + 1] == null);
    }
    if(this.props.bracket == 1) {
      prevMatchesNull = i == 0 || (i == 1 && bracket[j] == null);
    }

    var isFunctionalFirstRound = (this.props.bracket == 0 && i == 0);
    if(this.props.bracket == 1) {
      var allr1Null = this.props.rounds[1][0].every(i => { return i == null });
      isFunctionalFirstRound = (allr1Null && i == 1) || (!allr1Null && i == 0);
    }

    let parStyle1 = {height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1, borderBottom: "none", marginLeft: prevMatchesNull ? 0 : 20}
    let parStyle2 = {height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1, borderTop: "none", marginLeft: prevMatchesNull ? 0 : 20}
    var p1participant = Brackets.findOne() ? ( this.participant(p1, parStyle1) ) : (<Participant player={p1} parStyle={parStyle1} swapParticipant={this.props.swapParticipant} />)
    var p2participant = Brackets.findOne() ? ( this.participant(p2, parStyle2) ) : (<Participant player={p2} parStyle={parStyle2} swapParticipant={this.props.swapParticipant} />)

    return (
      <div className={`row x-center`} style={{marginBottom: blockMargin, position: "relative", left: !isFunctionalFirstRound && prevMatchesNull ? 20 : 0}}>
        {
          [
            <div className="match" onClick={() => {
              this.props.onMatchClick(match._id, this.props.bracket, this.props.roundNumber, this.props.matchNumber)
            }}>
              { p1participant }
              <div style={{width: participantWidth + (prevMatchesNull ? 20 : 40), height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
              </div>
              { p2participant }

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
        }
      </div>
    );
  }
};

export default DragDropContext(HTML5Backend)(MatchBlock)
