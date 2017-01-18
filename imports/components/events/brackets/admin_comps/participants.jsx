import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import BracketOptionsPanel from "../options.jsx";

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
    var img = ProfileImages.findOne(user.profile.image);
    return img ? img.url() : "/images/profile.png";
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

  onUserAdd(participant) {
    this.state.participants.push(participant);
    this.forceUpdate();
  }

  checkBracket(participants){
    if (this.state.participants.length < 4){

    }
  }

  updateList(oldVal, newVal)
  {
    participant = this.state.participants[oldVal];
    this.state.participants.splice(oldVal, 1); //Delete the participant off the list
    this.state.participants.splice(newVal, 0, participant); //Put him back at his new seeding area.
    this.forceUpdate();
  }

  startBracket()
  {
    console.log("Does this run?");
    this.state.started = true;
    this.forceUpdate();
  }

  randomizeSeeding()
  {
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }
    var nparticipants = shuffle(this.state.participants); //We might need to find a way to return the participants from the backend rather than put the work on the frontend
    //For now though, we need to get the same list of participants on both front and back end.
    Meteor.call("events.shuffle_seeding", this.state.iid, this.state.index, nparticipants, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully shuffled seeding.", "Success!");
        this.forceUpdate();
        this.state.participants = nparticipants;
      }
    });
  }

  render() {
    var participants = this.state.participants;
    return (
      <div>
        <BracketOptionsPanel bracketIndex={this.props.index} onComplete={this.onUserAdd.bind(this)} />
        <div>
        {
          this.state.started ? ( "" ):(<button onClick={this.randomizeSeeding.bind(this)}>Randomize Seeding</button>)
        }
        </div>
        <div className="col participant-table" style={{marginTop:"10px"}}>
          <div className="participant-row">
            <div className="col-1">
              Seed
            </div>
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
                  {
                    this.state.started ? ( <div>{index+1}</div> ) :(<SeedDropDown seedIndex={index} pSize={participants.length} index={this.state.index} id={this.state.iid} updateList={this.updateList.bind(this)} /> )
                  }
                  </div>
                  <div className="col-1">
                    { participant.alias }
                  </div>
                  <div className="col-1">
                    { user ? user.username : "" }
                  </div>
                  <div className="col-1 row" style={{justifyContent: "flex-end"}}>
                    <FontAwesome name="times" size="2x" onClick={() => { this.onUserDelete(participant.alias, index) }} />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className = { ((this.props.bracket.startedAt != null)) ?
          ("start-button-hide") :
          (this.state.participants.length < 3 ? ("start-button-hide"):("")) } style={{marginTop:"20px"}}>
          <StartBracketAction id ={this.state.id} index={this.props.index} sBracket={this.startBracket.bind(this)} />
        </div>
      </div>
    )
  }
}
