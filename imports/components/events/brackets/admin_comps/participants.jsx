import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import ParticipantAddField from "../participant_add_field.jsx";

import Instances from "/imports/api/event/instance.js";
import Brackets from "/imports/api/brackets/brackets.js";

import StartBracketAction from "./start.jsx";
import SeedDropDown from "./seeddropdown.jsx";

export default class AddPartipantAction extends Component {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var iid = instance._id;
    var bracket = instance.brackets[this.props.index];
    var started = instance.brackets[this.props.index].inProgress ? true:false;
    var participants = bracket.participants || [];
    this.state = {
      participants,
      iid,
      started,
      index: this.props.index
    }
  }

  imgOrDefault(user) {
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  onUserDelete(alias, index) {
    var eventId = Instances.findOne()._id;
    Meteor.call("events.brackets.removeParticipant", eventId, this.props.index, alias, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      this.state.participants.splice(index, 1);
      this.forceUpdate();
      return toastr.success("Successfully removed participant from event!", "Success!");
    })
  }

  render() {
    var participants = Instances.findOne().brackets[this.props.index].participants;
    return (
      <div className="row">
        {
          this.props.bracket.isComplete ? (
            ""
          ) : (
            <div className="col col-1" style={{marginRight: 20}}>
              <ParticipantAddField index={this.props.index} bracket={this.props.bracket} onStart={this.props.onStart} />

            </div>
          )
        }
        <div className="col-3 participant-table" style={{maxHeight: 500, overflowY: "auto"}}>
          {
            participants.map((participant, index) => {
              var user = Meteor.users.findOne(participant.id);

              // <div className="col-1">
              // {
              //   this.state.started ? ( <div>{index+1}</div> ) :(<SeedDropDown seedIndex={index} pSize={participants.length} index={this.state.index} id={this.state.iid} updateList={this.forceUpdate.bind(this)} /> )
              // }
              // </div>
              // <div className="col-1">
              //   { participant.alias }
              // </div>
              // <div className="col-1">
              //   { user ? user.username : "" }
              // </div>
              // <div className="col-1 row" style={{justifyContent: "flex-end"}}>
              //   <FontAwesome name="times" size="2x" onClick={() => { this.onUserDelete(participant.alias, index) }} />
              // </div>

              return (
                <div className="participant-row row x-center" key={index}>
                  <div style={{width: "10%"}}>
                    {
                      this.state.started ? ( <div>{index+1}</div> ) :(<SeedDropDown seedIndex={index} pSize={participants.length} index={this.state.index} id={this.state.iid} updateList={this.forceUpdate.bind(this)} /> )
                    }
                  </div>
                  <img src={this.imgOrDefault(user)} style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20}} />
                  <div className="col" style={{width: "15%"}}>
                    <span style={{fontSize: 16}}>{ participant.alias }</span>
                    <span style={{fontSize: 12}}>{ user ? user.username : "Anonymous" }</span>
                  </div>
                  <div>
                    <button>Check In</button>
                  </div>
                  <div className="col-1" style={{textAlign: "right"}}>
                    <FontAwesome name="cog" size="2x" />
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
