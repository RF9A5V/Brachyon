import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import Brackets from "/imports/api/brackets/brackets.js"

export default class RoundModal extends Component {

  constructor(props) {
    super(props);
    var match = Brackets.findOne().rounds[props.page].matches[props.i];
    this.state = {
      p1score: match.p1score,
      p2score: match.p2score,
      ties: match.ties,
      active: false
    }
  }

  updateMatch(fieldToUpdate, inc) {
    if(this.state.active) {
      return false;
    }
    var match = Brackets.findOne().rounds[this.props.page].matches[this.props.i];
    var score = 3;
    var multi = inc === true ? 1 : -1;
    var p1score = Math.max(match.p1score + (fieldToUpdate == "p1" ? 1 * multi : 0), 0);
    var p2score = Math.max(match.p2score + (fieldToUpdate == "p2" ? 1 * multi : 0), 0);
    var ties = Math.max(match.ties + (fieldToUpdate == "ties" ? 1 * multi : 0), 0);
    this.state.active = true;
  Meteor.call("events.update_roundmatch", Brackets.findOne()._id, this.props.page, this.props.i, score, p1score, p2score, ties, (err) => {
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
    var match = Brackets.findOne().rounds[this.props.page].matches[this.props.i];
    var playerOneID = this.props.aliasMap[match.playerOne];
    var playerTwoID = this.props.aliasMap[match.playerTwo];
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
              <div className="row center">
                <h3>Set the Winner</h3>
              </div>
              <div className="row flex-padaround col-1">
                <div className="col center x-center">
                  <img src={this.imgOrDefault(playerOneID)} style={{width: 100, height: "auto", borderRadius: "100%", marginBottom: 20}} />
                  <h5 style={{color: "#FF6000"}}>
                    {match.playerOne}
                  </h5>
                  <FontAwesome name="caret-up" style={{fontSize: 58}} onClick={() => {this.updateMatch("p1", true)}} />
                  <div className="row center x-center" style={{fontSize: 24, padding: 10, backgroundColor: "#333"}}>
                    { match.p1score }
                  </div>
                  <FontAwesome name="caret-down" style={{fontSize: 58}} onClick={() => {this.updateMatch("p1", false)}} />
                </div>
                <div className="col x-center center">
                  <img src={this.imgOrDefault(playerTwoID)} style={{width: 100, height: "auto", borderRadius: "100%", marginBottom: 20}} />
                  <h5 style={{color: "#FF6000"}}>
                    {match.playerTwo}
                  </h5>
                  <FontAwesome name="caret-up" style={{fontSize: 58}} onClick={() => {this.updateMatch("p2", true)}} />
                  <div className="row center x-center" style={{fontSize: 24, padding: 10, backgroundColor: "#333"}}>
                    { match.p2score }
                  </div>
                  <FontAwesome name="caret-down" style={{fontSize: 58}} onClick={() => {this.updateMatch("p2", false)}} />
                </div>
              </div>
              <div className="col">
                <div className="row center" style={{marginBottom: 20}}>
                  <h3>Ties</h3>
                </div>
                <div className="row center x-center" style={{marginBottom: 20}}>
                  <FontAwesome name="caret-left" style={{fontSize: 58}} onClick={() => {this.updateMatch("ties", false)}} />
                  <div className="row center x-center" style={{fontSize: 24, padding: 10, backgroundColor: "#333", margin: "0 10px"}}>
                    { match.ties }
                  </div>
                  <FontAwesome name="caret-right" style={{fontSize: 58}} onClick={() => {this.updateMatch("ties", true)}}  />
                </div>
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
