import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Matches from "/imports/api/event/matches.js";

export default class TournamentModal extends Component {

  getProfileImage(id) {
    var user = Meteor.users.findOne(id);
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  updateMatchScore(matchId, playerIndex, isInc) {
    Meteor.call("matches.updateScore", matchId, playerIndex, isInc, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      this.props.update();
    })
  }

  advanceMatch() {
    var func = "";
    switch(this.props.format) {
      case "single_elim": func="events.advance_single"; break;
      case "double_elim": func="events.advance_double"; break;
      default: break;
    }
    if(func.length == 0) {
      toastr.error("Modal not set up for swiss and RR");
      return;
    }
    Meteor.call(func, Brackets.findOne()._id, this.props.bracket, this.props.round, this.props.match, (err) => {
      if(err) {
        return toastr.error(err.reason);
      }
      this.props.closeModal();
    })
  }

  userScoreColumn(player, i) {
    var match = Matches.findOne(this.props.id);
    var maxScore = Math.max.apply(null, match.players.map(p => { return p.score }));
    return (
      <div className="col x-center col-1">
        <img src={this.getProfileImage(player.id)} style={{borderRadius: "100%", width: 100, height: "auto", marginBottom: 20}} />
        <h5 className={player.alias.length < 15 ? "" : "marquee"}
          style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ player.alias }
        </h5>
        <div className="col center x-center col-1">
          <div className="row center x-center" style={{marginTop:10}}>
            <FontAwesome className ="pointerChange" style={{fontSize: 40,marginRight:10}} name="caret-left" onClick={() => {
              if(player.score <= 0) {
                return;
              }
              this.updateMatchScore(this.props.id, i, false)
            }} />
            <div className="row center x-center button-score">
              { player.score }
            </div>
            <FontAwesome className="pointerChange" style={{fontSize: 40,marginLeft:10}} name="caret-right" onClick={() => {
              this.updateMatchScore(this.props.id, i, true)
            }} />
          </div>

        </div>
        {
          match.players.every((p,j) => { return player.score > p.score || j == i }) ? (
            <button onClick={this.advanceMatch.bind(this)}>Declare Winner</button>
          ) : (
            <button style={{opacity: 0.3}}>Declare Winner</button>
          )
        }
      </div>
    )
  }

  updateScoreContent() {
    var match = Matches.findOne(this.props.id);
    return (
      <div className="col" style={{height: "100%"}}>
        <div className="row col-1">
          {
            match.players.map((p, i) => {
              return this.userScoreColumn(p, i)
            })
          }
        </div>
        {
          Events.findOne() ? (
            <div className="row center">
              <button onClick={ () => {
                var event = Events.findOne();
                var brackIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
                if(brackIndex < 0) {
                  return;
                }
                browserHistory.push(`/event/${Events.findOne().slug}/bracket/${brackIndex}/match/${this.props.bracket}-${this.props.round}-${this.props.index}`)
              }}>View</button>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }

  render() {
    var event = Events.findOne();
    if(!event) {
      var instance = Instances.findOne();
      if(instance.owner != Meteor.userId()) {
        return null;
      }
    }
    else {
      if(event.owner != Meteor.userId()) {
        return null;
      }
    }
    if(!this.props.id) {
      return null;
    }
    var match = Matches.findOne(this.props.id);
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={() => {
        this.props.closeModal()
      }} contentLabel="Match Updater">
        <div className="self-end">
          <FontAwesome className ="pointerChange" name="times" size="2x" onClick={() => {
            this.props.closeModal()
          }} />
        </div>
        {
          match.winner == null ? (
            this.updateScoreContent()
          ):(
            <div className="col" style={{height: "100%"}}>
              <div className="row x-center">
                <button style={{marginRight: 20}}>Undo</button>
                {
                  Events.findOne() ? (
                    <button onClick={ () => {
                      var event = Events.findOne();
                      var brackIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
                      browserHistory.push(`/event/${Events.findOne().slug}/bracket/${brackIndex}/match/${this.props.id}`)
                    }}>View</button>
                  ) : (
                    ""
                  )
                }
              </div>
            </div>
          )
        }
      </Modal>
    );
  }
}
