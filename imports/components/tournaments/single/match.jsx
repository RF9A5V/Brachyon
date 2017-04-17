import React, { Component } from 'react'
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";
import { findDOMnode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd'

export default class MatchBlock extends Component {

  getUsername(p) {
    // return Meteor.users.findOne(id).username;
    if(!p) {
      return "TBD"
    }
    if(p.id) {
      return Meteor.users.findOne(p.id).username;
    }
    return p.alias;
  }

  getProfileImage(id) {
    var participants = Instances.findOne().brackets[0].participants;
    var user = null;
    for(var i in participants) {
      if(participants[i].alias == id) {
        user = Meteor.users.findOne(participants[i].id);
        break;
      }
    }
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  lineHeight() {
    var i = this.props.round;
    var j = this.props.index;

    // var matchComp = (50 * (Math.pow(2, i) - 1)) + (50 / 2);
    // var marginComp = (40 * (Math.pow(2, i) - 1)) + (40 / 2);
    var matchComp = (50 * (Math.pow(2, i - 1)));
    var marginComp = (20 * (Math.pow(2, i)));
    var totHeight = matchComp + marginComp;

    var height = totHeight;
    var top = totHeight / 2 + 10;
    if(j % 2 == 0) {
      top -= (7.5 * (Math.pow(2, i) + 1));
    }
    else {
      if(i == 1) {
        top += 2.5;
      }
      else if(i > 1) {
        top += (Math.pow(2, i - 1) + Math.pow(2, i - 2) - 1) * 10 + 2.5
      }
    }

    return { height, top }

  }

  render() {
    var [i, j, id] = [this.props.round, this.props.index, this.props.id];
    var match = this.props.match;

    var height = 35;
    var margin = 0;

    var lineHeight = 5;

    var blockHeight = height * 2 + margin * 2 + lineHeight;
    var blockMargin = 10;

    var vLineBase = blockHeight + blockMargin;
    var vLineHeight = Math.pow(2, i - 1) * vLineBase + lineHeight;

    var participantWidth = 200;

    if(!match) {
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

    var bracket = Brackets.findOne().rounds[0][0];
    var prevMatchesNull = this.props.round == 0 || (this.props.round == 1 && bracket[this.props.index * 2] == null && bracket[this.props.index * 2 + 1] == null);

    return (
      <div className="row x-center" style={{marginBottom: blockMargin, left: this.props.round == 1 && prevMatchesNull ? 20 : 0, position: "relative"}}>
        {
          match.players[0] == null && match.players[1] == null && i == 0 ? (
            <div style={{height: blockHeight}}>
            </div>
          ) : (
            [
              <div className="match" onClick={() => {
                this.props.onMatchClick(match._id, 0, this.props.round, this.props.index);
              }}>
                <div className="participant" style={{height, marginBottom: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p1) ? 0.5 : 1, borderBottom: "none", marginLeft: prevMatchesNull ? 0 : 20}}>
                  <div className={((p1.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p1.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p1.score || 0 }
                  </div>
                </div>
                <div style={{width: participantWidth + (prevMatchesNull ? 20 : 40), height: lineHeight, backgroundColor: this.props.isFutureLoser ? "#999" : "white"}}>
                </div>
                <div className="participant" style={{height, marginTop: margin, width: participantWidth, opacity: this.props.isFutureLoser || isLoser(p2) ? 0.5 : 1, borderTop: "none", marginLeft: prevMatchesNull ? 0 : 20}}>
                  <div className={((p2.alias || "TBD").length > 19 ? "marquee" : "") + " col-1 player"}>
                    { p2.alias || "TBD" }
                  </div>
                  <div className="score">
                    { p2.score || 0 }
                  </div>
                </div>

              </div>,
              this.props.isLast ? (
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
  }
}
