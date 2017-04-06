import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Brackets from "/imports/api/brackets/brackets.js"

export default class RoundModal extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  getMatch() {
    return Matches.findOne(Brackets.findOne().rounds[this.props.page][this.props.i].id);
  }

  updateMatch(fieldToUpdate, inc) {
    if(this.state.active) {
      return false;
    }
    var match = this.getMatch();
    var multi = inc === true ? 1 : -1;
    var p1s = fieldToUpdate == "p1" ? 1 * multi : 0;
    var p2s = fieldToUpdate == "p2" ? 1 * multi : 0;
    var ties = Math.max(match.ties + (fieldToUpdate == "ties" ? 1 * multi : 0), 0);
    this.state.active = true;
    Meteor.call("events.update_roundmatch", Brackets.findOne()._id, this.props.page, this.props.i, p1s, p2s, ties, (err) => {

      this.state.active = false;
      if(err){
        toastr.error("Couldn't advance this match.", "Error!");
        return err;
      }
      else {
        this.forceUpdate();
      }
    });
  }

  closeModal() {
    this.props.onRequestClose();
  }

  endMatch() {
    this.props.finalizeMatch(this.props.i);
    this.closeModal();
  }

  imgOrDefault(id) {
    var user = Meteor.users.findOne(id);
    if(user && user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  render() {
    var match = this.getMatch();
    var playerOneID = match.players[0].id;
    var playerTwoID = match.players[1].id;
    return (
      <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.props.open} onRequestClose={this.closeModal.bind(this)}>
        {
          match == null ? (
            ""
          ) : (
            <div className="col" style={{height: "100%"}}>
              <div className="self-end">
                <FontAwesome name="times" size="2x" onClick={this.closeModal.bind(this)} />
              </div>
              <div className="row flex-padaround col-1">
                <div className="col center x-center">
                  <img src={this.imgOrDefault(playerOneID)} style={{width: 100, height: "auto", borderRadius: "100%", marginBottom: 20}} />
                  <h5 className={(match.players[0].alias)==null?(""):
                      ((match.players[0].alias).length<15)?(""):("marquee")}
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ match.players[0].alias }
                  </h5>

                  <div className="row center x-center" style={{marginTop:10}}>
                    <FontAwesome name="caret-left" style={{fontSize: 40, marginRight:10}} onClick={() => {this.updateMatch("p1", false)}} />
                    <div className="row center x-center button-score">
                    { match.players[0].score }
                    </div>
                    <FontAwesome name="caret-right" style={{fontSize: 40, marginLeft:10}} onClick={() => {this.updateMatch("p1", true)}} />
                  </div>

                </div>
                <div className="col x-center center">
                  <img src={this.imgOrDefault(playerTwoID)} style={{width: 100, height: "auto", borderRadius: "100%", marginBottom: 20}} />
                  <h5 className={(match.players[1].alias)==null?(""):
                      ((match.players[1].alias).length<15)?(""):("marquee")}
                      style={{color: "#FF6000", width: "125px", textAlign:"center"}}>{ match.players[1].alias}
                  </h5>

                  <div className="row center x-center" style={{marginTop:10}}>
                    <FontAwesome name="caret-left" style={{fontSize: 40, marginRight:10}} onClick={() => {this.updateMatch("p2", false)}} />
                    <div className="row center x-center button-score">
                      { match.players[1].score }
                    </div>
                    <FontAwesome name="caret-right" style={{fontSize: 40, marginLeft:10}} onClick={() => {this.updateMatch("p2", true)}} />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="row center">
                  <h5>Ties</h5>
                </div>
                <div className="row center x-center">
                  <FontAwesome name="caret-left" style={{fontSize: 40, marginRight:10}} onClick={() => {this.updateMatch("ties", false)}} />
                  <div className="row center x-center button-score">
                    { match.ties }
                  </div>
                  <FontAwesome name="caret-right" style={{fontSize: 40, marginLeft:10}} onClick={() => {this.updateMatch("ties", true)}}  />
                </div>
              </div>
              <div className="row center">
                <button onClick={ () => {
                  var event = Events.findOne();
                  var brackIndex = Instances.findOne().brackets.findIndex(o => { return o.id == Brackets.findOne()._id });
                  browserHistory.push(`/events/${Events.findOne().slug}/brackets/${brackIndex}/match/${1}-${this.props.page + 1}-${this.props.i + 1}`)
                }}>View</button>
              </div>
              <div className="row center">
                <button onClick={() => { this.endMatch() }}>End Match</button>
              </div>
            </div>
          )
        }
      </Modal>
    )
  }
}
