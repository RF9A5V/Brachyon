import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import { getTopPlayers } from "/imports/decorators/get_top_players.js";
import { getSuffix } from "/imports/decorators/placement_suffix.js";

export default class CloseModal extends Component {

  closeBracket() {
    Meteor.call("events.brackets.close", Instances.findOne()._id, this.props.index || 0, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully closed bracket!", "Success!");
        this.props.onClose();
      }
    })
  }

  imgOrDefault(id) {
    const user = Meteor.users.findOne(id);
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  topPlayers() {
    var leaderboard = getTopPlayers(Brackets.findOne()._id);
    console.log(leaderboard);
    return (
      leaderboard.map((p, i) => {
        return (
          <div className="row" style={{width: 300, marginBottom: 10}}>
            <img src={this.imgOrDefault(p.id)} style={{width: 75, height: 75}} />
            <div className="col col-1" style={{padding: 10, backgroundColor: "#666", alignItems: "flex-start"}}>
              <span>
                { p.alias }
              </span>
              <span>
                { getSuffix(i + 1) }
              </span>
            </div>
          </div>
        )
      })
    )
  }

  render() {
    const bracket = Brackets.findOne();
    console.log(this.props.open);
    if(!this.props.open) {
      return null;
    }
    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="row justify-end">
          <FontAwesome name="times" size="2x" onClick={this.props.onClose} />
        </div>
        <div className="row center" style={{marginBottom: 10}}>
          <h5>Close This Bracket</h5>
        </div>
        <div className="row center">
          <p style={{marginBottom: 10}}>Here's a breakdown of the Top Four just to make sure these results look right.</p>
        </div>
        <div className="col center x-center">
          {
            this.topPlayers()
          }
        </div>
        <div className="row center">
          <button onClick={this.closeBracket.bind(this)}>
            Close Bracket
          </button>
        </div>
      </Modal>
    )
  }
}
