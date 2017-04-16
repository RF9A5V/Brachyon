import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Matches from "/imports/api/event/matches.js";

import { numToAlpha } from "/imports/decorators/num_to_alpha.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class MatchBlock extends ResponsiveComponent {

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

  matchPlaceholder(alias, playerIndex) {
    if(alias) {
      return alias;
    }
    const id = this.props.match._id || this.props.match.id;
    const data = this.props.matchMap[id];
    const source = data.source.slice().sort((a, b) => {
      if(a.lost && !b.lost) {
        return -1;
      }
      else if(!a.lost && b.lost) {
        return 1;
      }
      else if(a.lost && b.lost) {
        return (a.number - b.number) / Math.abs(a.number - b.number) * -1;
      }
      else {
        return (a.number - b.number) / Math.abs(a.number - b.number);
      }
    })
    var dataSource = source[playerIndex];
    if(!dataSource) {
      return "Unknown";
    }
    const number = this.props.matchMap[dataSource.id].number;
    return (dataSource.lost ? "Loser" : "Winner") + " of " + numToAlpha(number);
  }

  renderBase(opts) {
    var match = this.props.match;
    var emptyWinnersMatch = (this.props.bracket == 0 && !match);
    var [i, j] = [this.props.roundNumber, this.props.matchNumber];
    var k = this.props.bracket ? Math.floor(i/2):i;

    var height = opts.height;
    var margin = 0;

    var lineHeight = opts.lineHeight;

    var blockHeight = height * 2 + margin * 2 + lineHeight;
    var blockMargin = opts.blockMargin;

    var vLineBase = blockHeight + blockMargin;
    var vLineHeight = Math.pow(2, i - 1) * vLineBase + lineHeight;
    if(this.props.bracket == 1) {
      vLineHeight = Math.pow(2, parseInt(i / 2) - 1) * vLineBase + lineHeight
    }

    var participantWidth = opts.pWidth;

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

    return (
      <div className="row x-center" style={{marginBottom: blockMargin, position: "relative", left: prevMatchesNull && !isFunctionalFirstRound ? blockMargin : 0}}>
        {
          prevMatchesNull ? (
            null
          ) : (
            <div style={{width: blockMargin, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
            </div>
          )
        }
        <div className="col center x-center" style={{padding: 5, fontSize: 12, width: blockMargin, height: height * 2 + lineHeight, backgroundColor: "black", border: "solid 2px white", borderRight: "none"}}>
          { numToAlpha(this.props.matchMap[this.props.match.id].number).split("").map(c => {
            return (
              <span style={{fontSize: opts.fontSize}}>
                { c }
              </span>
            )
          }) }
        </div>
        {
          [
            <div className="match" onClick={() => {
              this.props.onMatchClick(match._id, this.props.bracket, this.props.roundNumber, this.props.matchNumber)
            }}>
              <div className="participant" style={{height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1, borderBottom: "none"}}>
                {
                  p1.alias ? (
                    <div className="seed row center x-center" style={{fontSize: `calc(${opts.fontSize} * 0.8)`}}>
                      { this.props.partMap[p1.alias] }
                    </div>
                  ) : (
                    null
                  )
                }
                <div className={((p1.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"} style={{fontSize: `calc(${opts.fontSize} * 0.8)`, paddingLeft: !p1.alias ? "calc(10% + 5px)" : 5, fontStyle: p1.alias ? "normal" : "italic"}}>
                  { this.matchPlaceholder(p1.alias, 0) }
                </div>
                <div className="score" style={{fontSize: opts.fontSize}}>
                  { p1.score || 0 }
                </div>
              </div>
              <div style={{width: participantWidth + blockMargin, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
              </div>
              <div className="participant" style={{height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1, borderTop: "none"}}>
                {
                  p2.alias ? (
                    <div className="seed row center x-center" style={{fontSize: `calc(${opts.fontSize} * 0.8)`}}>
                      { this.props.partMap[p2.alias] }
                    </div>
                  ) : (
                    null
                  )
                }
                <div className={((p2.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"} style={{fontSize: `calc(${opts.fontSize} * 0.8)`, paddingLeft: !p2.alias ? "calc(10% + 5px)" : 5, fontStyle: p2.alias ? "normal" : "italic"}}>
                  { this.matchPlaceholder(p2.alias, 1) }
                </div>
                <div className="score" style={{fontSize: opts.fontSize}}>
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
                zIndex: this.props.isFutureLoser ? 0 : 0,
                top: ((vLineHeight / 2 - lineHeight / 2) * (j % 2 == 0 ? 1 : -1))
              }}>
              </div>
            )
          ]
        }
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      height: 35,
      lineHeight: 5,
      blockMargin: 20,
      fontSize: "1em",
      pWidth: 200
    });
  }

  renderMobile() {
    return this.renderBase({
      height: 70,
      lineHeight: 10,
      blockMargin: 40,
      fontSize: "2em",
      pWidth: 350
    })
  }
}
