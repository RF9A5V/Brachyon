import React, { Component } from 'react';
import FontAwesome from "react-fontawesome";
import Participant from "./participant.jsx";
import { browserHistory } from "react-router";

import Matches from "/imports/api/event/matches.js";

import { numToAlpha } from "/imports/decorators/num_to_alpha.js";
import { openTweet, openFB } from "/imports/decorators/open_social.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class MatchBlock extends ResponsiveComponent {

  constructor(props) {
    super(props);
  }

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
    const isAllLosers = data.source.every(s => {
      return s.lost;
    });
    var source;
    if(isAllLosers && this.props.roundNumber % 2 == 1) {
      source = data.source.slice().reverse();
    }
    else {
      source = data.source;
    }
    var dataSource = source[playerIndex];
    const number = this.props.matchMap[dataSource.id].number;
    return (dataSource.lost ? "Loser" : "Winner") + " of " + numToAlpha(number);
  }

  participant(p, s, i, opts) {
    return (
      <div className={`participant ${this.props.activeAlias == p.alias && this.props.activeAlias != null ? "active" : ""}`} style={s} onMouseEnter={(e) => {
        this.props.onParticipantHover(p.alias)
      }} onMouseLeave={(e) => {
        this.props.onParticipantHover(null)
      }}>
        {
          p.alias ? (
            <div className="seed row center x-center" style={{fontSize: `calc(${opts.fontSize} * 0.8)`}}>
              { this.props.partMap[p.alias] }
            </div>
          ) : (
            null
          )
        }
        <div className={((p.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}
        style={{fontSize: `calc(${opts.fontSize} * 0.8)`, paddingLeft: !p.alias ? "calc(10% + 5px)" : 5, fontStyle: p.alias ? "normal" : "italic"}}>
          { this.matchPlaceholder(p.alias, i) }
        </div>
        <div className="score" style={{fontSize: opts.fontSize}}>
          { p.score || 0 }
        </div>
      </div>
    )
  }

  onMatchStart(e) {
    e.preventDefault();
    e.stopPropagation();
    Meteor.call("match.start", this.props.match._id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  onMatchUnstart(e) {
    e.preventDefault();
    e.stopPropagation();
    Meteor.call("match.unstart", this.props.match._id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  onMatchQueue(e) {
    e.preventDefault();
    e.stopPropagation();
    Meteor.call("match.toggleStream", this.props.match._id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  undoMatch() {
    const bracket = Brackets.findOne();
    const bracketSize = bracket.rounds.length;
    var func = bracketSize == 1 ? "events.undo_single" : "events.undo_double";
    if(func.length == 0) {
      toastr.error("Modal not set up for swiss and RR");
      return;
    }
    Meteor.call(func, bracket._id, this.props.bracket, this.props.roundNumber, this.props.matchNumber, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      this.props.update();
    })
  }

  topActions(status) {
    const actionStyle = {
      padding: 2.5,
      backgroundColor: "#111"
    }
    const containerStyle = {
      width: "calc(100% - 20px)",
      position: "absolute",
      top: -19,
      cursor: "pointer",
      fontSize: 10,
      border: "solid 1px white"
    }

    var content;

    const organizable = Events.findOne() || Instances.findOne();

    if(status == 0 || !this.state.hoverActive || Meteor.userId() != organizable.owner) {
      return null;
    }

    else if(status == 1) {
      content = (
        [
          <div className="row center x-center col-1 hover-blue" style={{...actionStyle, borderRight: "solid 2px white"}} onClick={this.onMatchQueue.bind(this)}>
            { this.props.match.stream ? "Not Stream" : "Stream" }
          </div>,
          <div className="row center x-center col-1 hover-blue" style={actionStyle} onClick={this.onMatchStart.bind(this)}>
            Start
          </div>
        ]
      )
    }
    else if(status == 2) {
      content = (
        <div className="row center x-center col-1 hover-blue" style={actionStyle} onClick={this.onMatchUnstart.bind(this)}>
          Stop
        </div>
      )
    }
    else {
      content = (
        <div className="row center x-center col-1 hover-blue" style={actionStyle} onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          this.undoMatch()
        }}>
          Undo
        </div>
      )
    }
    return (
      <div className="row" style={containerStyle}>
        { content }
      </div>
    )
  }

  shareAction(type) {
    const match = this.props.match;
    if(match.status == 0) {
      return null;
    }
    var text;
    const players = match.players.map(p => {
      if(p.id) {
        var user = Meteor.users.findOne(p.id);
        if(user.services.twitter && type == "twitter") {
          return "@" + user.services.twitter.screenName;
        }
      }
      return p.alias;
    });
    if(match.status == 1) {
      text = `${players[0][0] == "@" ? "." : ""}${players[0]} vs. ${players[1]} on Brachyon!`;
    }
    else if(match.status == 2) {
      text = `${players[0][0] == "@" ? "." : ""}${players[0]} vs. ${players[1]} happening now on Brachyon!`;
    }
    else {
      const winner = match.winner;
      const loserIndex = match.players.findIndex(o => { return o.alias != winner.alias });
      const loser = match.players[loserIndex];
      text = `${players[1 - loserIndex][0] == "@" ? "." : ""}${players[1 - loserIndex]} beats ${players[loserIndex]} ${match.players[1-loserIndex].score}-${match.players[loserIndex].score}!`;
    }
    var url = window.location.href.slice(0, window.location.href.indexOf("/admin"));
    type == "twitter" ? openTweet(text, url) : openFB(text, url);
  }

  bottomActions(status) {
    const actionStyle = {
      padding: 2.5,
      backgroundColor: "#111"
    }
    const containerStyle = {
      width: "calc(100% - 20px)",
      position: "absolute",
      bottom: -19,
      cursor: "pointer",
      fontSize: 10,
      border: "solid 1px white"
    }
    if(status == 0 || !this.state.hoverActive) {
      return null;
    }
    return (
      <div className="row" style={containerStyle}>
        <div className="row center x-center col-1 hover-fb" style={{...actionStyle, borderRight: "solid 1px white"}} onClick={() => { this.shareAction("fb") }}>
          <FontAwesome name="facebook" style={{marginRight: 5, color: "inherit"}} />
          Share
        </div>
        <div className="row center x-center col-1 hover-twitter" style={actionStyle} onClick={() => { this.shareAction("twitter") }}>
          <FontAwesome name="twitter" style={{marginRight: 5, color: "inherit"}} />
          Tweet
        </div>
      </div>
    )
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

    const bObj = Brackets.findOne();

    let parStyle1 = {height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1, borderBottom: "none"}
    let parStyle2 = {height, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1, borderTop: "none"}
    var p1participant = !bObj && p1.alias ? (<Participant player={p1} parStyle={parStyle1} swapParticipant={this.props.swapParticipant} partMap={this.props.partMap} index={0} opts={opts} matchPlaceholder={this.matchPlaceholder.bind(this)} />) : ( this.participant(p1, parStyle1, 0, opts) )
    var p2participant = !bObj && p2.alias ? (
      <Participant player={p2} parStyle={parStyle2} swapParticipant={this.props.swapParticipant} partMap={this.props.partMap} index={1} opts={opts} matchPlaceholder={this.matchPlaceholder.bind(this)} />
      ) : ( this.participant(p2, parStyle2, 1, opts) )
    return (
      <div className="row x-center" style={{marginBottom: blockMargin, position: "relative", left: prevMatchesNull && !isFunctionalFirstRound ? blockMargin : 0}}
      onMouseEnter={() => {
        if(bObj) {
          this.setState({hoverActive: true})
        }
      }} onMouseLeave={() => { this.setState({ hoverActive: false }) }}>
        {
          prevMatchesNull ? (
            null
          ) : (
            <div style={{width: blockMargin, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
            </div>
          )
        }
        <div className="col" style={{position: "relative"}}>
          {
            this.topActions(match.status)
          }
          <div className="row">
            <div className="col center x-center" style={{padding: 5, fontSize: 12, width: blockMargin, height: height * 2 + lineHeight, backgroundColor: match.status == 2 ? "#FF6000" : "black", border: "solid 2px white", borderRight: "none"}}>
              { numToAlpha(this.props.matchMap[this.props.match._id || this.props.match.id].number).split("").map(c => {
                return (
                  <span style={{fontSize: opts.fontSize, color: match.status == 2 ? "black" : "white"}}>
                    { c }
                  </span>
                )
              }) }
            </div>
            <div className="match" onClick={() => {
              this.props.onMatchClick(match._id, this.props.bracket, this.props.roundNumber, this.props.matchNumber)
            }}>
              { p1participant }
              <div style={{width: participantWidth + blockMargin, height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
              </div>
              { p2participant }
            </div>
          </div>
          {
            this.bottomActions(match.status)
          }
        </div>
        {
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
        }
      </div>
    );
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
