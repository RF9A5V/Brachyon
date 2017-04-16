import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Matches from "/imports/api/event/matches.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class TournamentModal extends ResponsiveComponent {

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

  undoMatch() {
    var func = "";
    switch(this.props.format) {
      case "single_elim": func="events.undo_single"; break;
      case "double_elim": func="events.undo_double"; break;
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

  userScoreColumn(player, i, opts) {
    var match = Matches.findOne(this.props.id);
    var maxScore = Math.max.apply(null, match.players.map(p => { return p.score }));
    return (
      <div className="col x-center col-1">
        <img src={this.getProfileImage(player.id)} style={{borderRadius: "100%", width: opts.imgDim, height: "auto", marginBottom: 20}} />
        <h5 className={player.alias.length < 15 ? "" : "marquee"}
          style={{color: "#FF6000", textAlign:"center", fontSize: opts.fontSize}}>{ player.alias }
        </h5>
        <div className="col center x-center col-1">
          <div className="row center x-center" style={{marginTop:10}}>
            <FontAwesome className ="pointerChange" style={{fontSize: opts.iconSize,marginRight:10}} name="caret-left" onClick={() => {
              if(player.score <= 0) {
                return;
              }
              this.updateMatchScore(this.props.id, i, false)
            }} />
            <div className="row center x-center button-score" style={{fontSize: opts.iconSize}}>
              { player.score }
            </div>
            <FontAwesome className="pointerChange" style={{fontSize: opts.iconSize,marginLeft:10}} name="caret-right" onClick={() => {
              this.updateMatchScore(this.props.id, i, true)
            }} />
          </div>

        </div>
        {
          match.players.every((p,j) => { return player.score > p.score || j == i }) ? (
            <button className={opts.buttonClass} onClick={this.advanceMatch.bind(this)}>Declare Winner</button>
          ) : (
            <button className={opts.buttonClass} style={{opacity: 0.3}}>Declare Winner</button>
          )
        }
      </div>
    )
  }

  updateScoreContent(opts) {
    var match = Matches.findOne(this.props.id);
    return (
      <div className="col center x-center" style={{height: "100%"}}>
        <div className="row" style={{justifyContent: "space-between", width: "100%"}}>
          {
            match.players.map((p, i) => {
              return this.userScoreColumn(p, i, opts)
            })
          }
        </div>
        {
          Events.findOne() ? (
            <div className="row center">
              <button className={opts.buttonClass} onClick={ () => {
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

  renderBase(opts) {
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
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={() => {
        this.props.closeModal()
      }} contentLabel="Match Updater">
        <div className="row" style={{justifyContent: "flex-end"}}>
          <FontAwesome className ="pointerChange" name="times" onClick={() => {
            this.props.closeModal()
          }} style={{fontSize: opts.iconSize}} />
        </div>
        {
          match.winner == null ? (
            this.updateScoreContent(opts)
          ):(
            <div className="col center x-center" style={{height: "100%"}}>
              <div className="row center x-center">
                <button className={opts.buttonClass} style={{marginRight: 20}} onClick={this.undoMatch.bind(this)}>Undo</button>
                {
                  Events.findOne() ? (
                    <button className={opts.buttonClass} onClick={ () => {
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

  renderDesktop() {
    return this.renderBase({
      modalClass: "create-modal",
      overlayClass: "overlay-class",
      fontSize: "2.5em",
      iconSize: "1em",
      buttonClass: "",
      imgDim: 150
    });
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      fontSize: "3em",
      iconSize: "5em",
      buttonClass: "large-button",
      imgDim: 300
    });
  }
}
