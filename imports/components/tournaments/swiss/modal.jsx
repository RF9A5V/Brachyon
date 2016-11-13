import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";
import Brackets from "/imports/api/brackets/brackets.js"

export default class SwissModal extends Component {

  constructor(props) {
    super(props);
    var match = Brackets.findOne().rounds[props.page].matches[props.i];
    var instanceID = Events.findOne().instances.pop();
    var instance = Instances.findOne(instanceID);
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
    var instanceID = Events.findOne().instances.pop();
    var instance = Instances.findOne(instanceID);
    var score = 3;
    var multi = inc === true ? 1 : -1;
    var p1score = Math.max(match.p1score + (fieldToUpdate == "p1" ? 1 * multi : 0), 0);
    var p2score = Math.max(match.p2score + (fieldToUpdate == "p2" ? 1 * multi : 0), 0);
    var ties = Math.max(match.ties + (fieldToUpdate == "ties" ? 1 * multi : 0), 0);
    this.state.active = true;
    Meteor.call("events.update_match", Brackets.findOne()._id, this.props.page, this.props.i, score, p1score, p2score, ties, (err) => {
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
    var instanceID = Events.findOne().instances.pop();
    var instance = Instances.findOne(instanceID);
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
                  <img src={this.imgOrDefault(playerOneID)} style={{width: 50, height: 50, borderRadius: "100%", marginBottom: 20}} />
                  <div style={{marginBottom: 20}} className="participant-active">
                    {match.playerOne}
                  </div>
                  <FontAwesome name="plus" size="3x" onClick={() => {this.updateMatch("p1", true)}} />
                  <div style={{fontSize: 20, fontWeight: "bold", margin: "20px 0"}}>
                    { match.p1score }
                  </div>
                  <FontAwesome name="minus" size="3x" onClick={() => {this.updateMatch("p1", false)}} />
                </div>
                <div className="col x-center center">
                  <img src={this.imgOrDefault(playerTwoID)} style={{width: 50, height: 50, borderRadius: "100%", marginBottom: 20}} />
                  <div style={{marginBottom: 20}} className="participant-active">
                    {match.playerTwo}
                  </div>
                  <FontAwesome name="plus" size="3x" onClick={() => {this.updateMatch("p2", true)}} />
                  <div style={{fontSize: 20, fontWeight: "bold", margin: "20px 0"}}>
                    { match.p2score }
                  </div>
                  <FontAwesome name="minus" size="3x" onClick={() => {this.updateMatch("p2", false)}} />
                </div>
              </div>
              <div className="col">
                <div className="row center" style={{marginBottom: 20}}>
                  <h3>Ties</h3>
                </div>
                <div className="row center x-center" style={{marginBottom: 20}}>
                  <FontAwesome name="minus" onClick={() => {this.updateMatch("ties", false)}} />
                  <div style={{margin: "0 20px", fontSize: 20, fontWeight: "bold"}}>
                    { match.ties }
                  </div>
                  <FontAwesome name="plus" onClick={() => {this.updateMatch("ties", true)}}  />
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
