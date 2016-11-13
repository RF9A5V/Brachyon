import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import BracketOptionsPanel from "../options.jsx";

import Instances from "/imports/api/event/instance.js";

export default class AddPartipantAction extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[this.props.index];
    var participants = bracket.participants || [];
    var hasPrice = !isNaN(instance.tickets[`bracketEntry${this.props.index}`]) && instance.tickets[`bracketEntry${this.props.index}`] >= 0;
    this.state = {
      participants,
      open: false,
      hasPrice
    }
  }

  imgOrDefault(user) {
    var img = ProfileImages.findOne(user.profile.image);
    return img ? img.url() : "/images/profile.png";
  }

  onUserDelete(alias, id, index) {
    var eventId = Events.findOne()._id;
    Meteor.call("events.brackets.removeParticipant", eventId, this.props.index, alias, id, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      this.state.participants.splice(index, 1);
      this.setState({ open: false, alias: null, index: null })
      return toastr.success("Successfully removed participant from event!", "Success!");
    })
  }

  onUserAdd(participant) {
    this.state.participants.push(participant);
    this.forceUpdate();
  }

  render() {
    var instance = Instances.findOne();
    var participants = this.state.participants;
    return (
      <div>
        <BracketOptionsPanel bracketIndex={this.props.index} onComplete={this.onUserAdd.bind(this)} />
        <div className="col participant-table">
          <div className="participant-row">
            <div className="col-1">
              Alias
            </div>
            <div className="col-1">
              Username
            </div>
            <div className="col-1 row" style={{justifyContent: "flex-end"}}>
              Delete
            </div>
          </div>
          {
            participants.map((participant, index) => {
              var user = Meteor.users.findOne(participant.id);
              return (
                <div className="participant-row" key={index}>
                  <div className="col-1">
                    { participant.alias }
                  </div>
                  <div className="col-1">
                    { user ? user.username : "" }
                  </div>
                  <div className="col-1 row" style={{justifyContent: "flex-end"}}>
                    {
                      this.state.hasPrice && instance.access[participant.id] && instance.access[participant.id][`bracketEntry${this.props.index}`] && instance.access[participant.id][`bracketEntry${this.props.index}`].charge != null ? (
                        <button onClick={() => {
                          this.setState({ open: true, alias: participant.alias, id: participant.id });
                        }}>
                          Refund
                        </button>
                      ) : (
                        <button onClick={() => {
                          this.onUserDelete(participant.alias, participant.id, index);
                        }}>
                          Delete
                        </button>
                      )
                    }
                  </div>
                </div>
              )
            })
          }
        </div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
          <div className="row">
            <div className="col-1"></div>
            <FontAwesome name="times" size="2x" onClick={() => { this.setState({ open: false }) }} />
          </div>
          <h3>Refund Payment</h3>
          <span>
            { this.state.alias } has paid ${(instance.tickets[`bracketEntry${this.props.index}`] / 100).toFixed(2)} to you for entry to this bracket. Removing this player will refund the paid amount from your account to them. Are you sure you want to continue with this action?
          </span>
          <div className="row center">
            <button onClick={() => { this.onUserDelete(this.state.alias, this.state.id, this.props.index); }} style={{marginRight: 10}}>
              Yes
            </button>
            <button onClick={() => { this.setState({ open: false }) }}>
              No
            </button>
          </div>
        </Modal>
      </div>
    )
  }
}
