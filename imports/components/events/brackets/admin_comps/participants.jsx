import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketOptionsPanel from "../options.jsx";

export default class AddPartipantAction extends Component {

  constructor(props) {
    super(props);
    var bracket = Events.findOne().brackets[this.props.index];
    var participants = bracket.participants || [];
    this.state = {
      participants
    }
  }

  imgOrDefault(user) {
    var img = ProfileImages.findOne(user.profile.image);
    return img ? img.url() : "/images/profile.png";
  }

  onUserDelete(alias, index) {
    var eventId = Events.findOne()._id;
    Meteor.call("events.brackets.removeParticipant", eventId, this.props.index, alias, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      this.state.participants.splice(index, 1);
      this.forceUpdate();
      return toastr.success("Successfully removed participant from event!", "Success!");
    })
  }

  onUserAdd(participant) {
    this.state.participants.push(participant);
    this.forceUpdate();
  }

  render() {
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
            <div className="col-1">
              Email
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
                  <div className="col-1">
                    { participant.email || "" }
                  </div>
                  <div className="col-1 row" style={{justifyContent: "flex-end"}}>
                    <FontAwesome name="times" size="2x" onClick={() => { this.onUserDelete(participant.alias, index) }} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
