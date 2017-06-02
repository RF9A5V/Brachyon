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
      this.forceUpdate();
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
      else {
        // Hacky but fixes the issue with not live uploading.
        // TODO: WHY? There is no reason that we should have to do this?
        setTimeout(() => {
          this.props.update();
          this.props.closeModal();
        }, 250)
      }
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
      this.props.update();
    })
  }

  userScoreColumn(player, i, opts) {
    var match = Matches.findOne(this.props.id);
    if(!match) {
      return null;
    }
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
      </div>
    )
  }

  onMatchStart() {
    Meteor.call("match.start", this.props.id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  onMatchUnstart() {
    Meteor.call("match.unstart", this.props.id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  onMatchQueue() {
    Meteor.call("match.toggleStream", this.props.id, () => {
      this.props.update();
      this.forceUpdate();
    })
  }

  setMatchStation(e) {
    var value = e.target.value || null;
    const match = Matches.findOne(this.props.id);
    if(value && value != match.station) {
      Meteor.call("match.setStation", this.props.id, e.target.value, () => {
        this.props.update();
        this.forceUpdate();
      })
    }

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
      const isAdmin = event.staff && event.staff.admins && event.staff.admins.indexOf(Meteor.userId()) >= 0;
      if(event.owner != Meteor.userId() && !isAdmin) {
        return null;
      }
    }
    if(!this.props.id) {
      return null;
    }
    const match = Matches.findOne(this.props.id);
    if(!match) {
      return null;
    }
    var color = "#FFFFFF";
    if(match.status == 2) {
      color = "#00BDFF";
    }
    else if(match.status == 3) {
      color = "#FF6000";
    }
    return (
      <Modal className={opts.modalClass} overlayClassName={opts.overlayClass} isOpen={this.props.open} onRequestClose={() => {
        this.props.closeModal()
      }} contentLabel="Match Updater">
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome className ="pointerChange" name="times" onClick={() => {
              this.props.closeModal()
            }} style={{fontSize: opts.iconSize}} />
          </div>
          <div className="row center" style={{marginBottom: 10}}>
            <span style={{fontSize: opts.fontSize}}>
              Status: <span style={{color}}>{
                (() => {
                  switch(match.status) {
                    case 0: return "Waiting"
                    case 1: return match.stream ? "On Deck" : "Ready"
                    case 2: return match.stream ? "Streaming" : "Playing"
                    case 3: return "Complete"
                  }
                })()
              }</span>
            </span>
          </div>
          <div className="col center col-1">
            {
              match.winner == null ? (
                <div>
                  {
                    this.updateScoreContent(opts)
                  }
                  <div className="col x-center" style={{marginTop: 20}}>
                    <span style={{fontSize: opts.fontSize}}>Set Status (Optional)</span>
                    <hr className="user-divider" />
                    <div className="row center" style={{width: "100%", marginBottom: 20}}>
                      <label className="input-label row center x-center">
                        Station
                      </label>
                      <input type="text" className={`col-1 ${opts.inputClass}`} style={{margin: 0}} onBlur={this.setMatchStation.bind(this)} defaultValue={match.station}/>
                    </div>
                    <div className="row center" style={{width: "100%"}}>
                      {
                        match.status == 2 ? (
                          <button className={opts.buttonClass} onClick={this.onMatchUnstart.bind(this)}>
                            Unset Match
                          </button>
                        ) : (
                          null
                        )
                      }
                      {
                        match.status == 1 ? (
                          [
                            <button className={opts.buttonClass} style={{flex: match.status == 1 ? 1 : null, marginRight: match.status == 1 ? 20 : 0}} onClick={this.onMatchQueue.bind(this)}>
                              {
                                match.stream ? (
                                  "Remove from Stream"
                                ) : (
                                  "Queue for Stream"
                                )
                              }
                            </button>,
                            <button className={opts.buttonClass} style={{flex: 1}} onClick={this.onMatchStart.bind(this)}>
                              {
                                match.stream ? (
                                  "Start Stream Match"
                                ) : (
                                  "Start Match"
                                )
                              }
                            </button>
                          ]

                        ) : (
                          null
                        )
                      }
                    </div>
                  </div>
                </div>
              ):(
                null
              )
            }
            {
              match.status == 3 ? (
                <div className="col center x-center" style={{height: "100%"}}>
                  <div className="row center x-center">
                    <button className={opts.buttonClass} style={{marginRight: 20}} onClick={this.undoMatch.bind(this)}>Undo</button>
                  </div>
                </div>
              ) : (
                null
              )
            }
          </div>
        </div>
      </Modal>
    );
  }

  renderDesktop() {
    return this.renderBase({
      modalClass: "create-modal",
      overlayClass: "overlay-class",
      fontSize: "1em",
      iconSize: "2.5em",
      buttonClass: "",
      imgDim: 150,
      inputClass: ""
    });
  }

  renderMobile() {
    return this.renderBase({
      modalClass: "overlay-only-modal",
      overlayClass: "overlay-only",
      fontSize: "1em",
      iconSize: "2.5em",
      imgDim: 150
    });
  }
}
