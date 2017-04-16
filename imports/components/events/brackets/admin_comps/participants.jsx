import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import ParticipantAddField from "../participant_add_field.jsx";
import TicketDiscountModal from "../ticket_discount_modal.jsx";
import OptionsModal from "./options.jsx";
import StartModal from "./start_modal.jsx";

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
    let completed = bracket.isComplete;
    var participants = bracket.participants || [];
    this.state = {
      participants,
      iid,
      completed,
      index: this.props.index,
      discountOpen: false,
      optionsOpen: false,
      startOpen: false
    }
  }

  imgOrDefault(user) {
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  onUserCheckIn(participant, onCheckedIn) {
    const cb = () => {
      Meteor.call("events.checkInUser", Events.findOne()._id, this.props.index, participant.alias, (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          toastr.success("Successfully checked in user!");
          onCheckedIn(true);
        }
      })
    }
    if(participant.id) {
      Meteor.call("tickets.charge", Instances.findOne()._id, this.props.index, participant.id, (err) => {
        if(err) {
          onCheckedIn(false);
          return toastr.error(err.reason);
        }
        else {
          cb()
        }
      })
    }
    else {
      cb();
    }
  }

  render() {
    const instance = Instances.findOne();
    const participants = instance.brackets[this.props.index].participants || [];
    return (
      <div className="row">
        {
          this.props.bracket.isComplete ? (
            ""
          ) : (
            <div className="col col-1" style={{marginRight: 20}}>
              <ParticipantAddField index={this.props.index} bracket={this.props.bracket} onStart={() => { this.setState({ startOpen: true }) }} onParticipantAdd={(p) => {
                this.setState({
                  participant: p,
                  discountOpen: true
                })
              }} onBracketStart={() => {
                this.setState({
                  startOpen: true
                })
              }} />

            </div>
          )
        }
        <div className="col-3 participant-table" style={{maxHeight: 500, overflowY: "auto"}}>
          {
            participants.map((participant, index) => {
              const user = Meteor.users.findOne(participant.id);

              return (
                <div className="participant-row row x-center" key={index}>
                  <div style={{width: "10%"}}>
                    {
                      this.state.completed ? ( <div>{index+1}</div> ) : (<SeedDropDown seedIndex={index} pSize={participants.length} index={this.state.index} id={this.state.iid} updateList={this.forceUpdate.bind(this)} /> )
                    }
                  </div>
                  <img src={this.imgOrDefault(user)} style={{width: 50, height: 50, borderRadius: "100%", marginRight: 20}} />
                  <div className="col" style={{width: "15%"}}>
                    <span style={{fontSize: 16}}>{ participant.alias }</span>
                    <span style={{fontSize: 12}}>{ user ? user.username : "Anonymous" }</span>
                  </div>
                  <div>
                    {
                      participant.checkedIn ? (
                        <span>Checked In</span>
                      ) : (
                        <button onClick={() => {
                          if(instance.tickets) {
                            this.setState({ discountOpen: true, participant })
                          }
                          else {
                            this.onUserCheckIn(participant);
                          }
                        }}>Check In</button>
                      )
                    }
                  </div>
                  <div className="col-1" style={{textAlign: "right"}}>
                    <FontAwesome name="cog" size="2x" style={{cursor: "pointer"}} onClick={() => { this.setState({ optionsOpen: true, participant }) }} />
                  </div>
                </div>
              )
            })
          }
        </div>
        {
          instance.tickets ? (
            <TicketDiscountModal open={this.state.discountOpen} onClose={() => { this.setState({ discountOpen: false }) }} participant={this.state.participant} index={this.props.index} onCheckIn={this.onUserCheckIn.bind(this)} />
          ) : (
            ""
          )
        }
        <OptionsModal open={this.state.optionsOpen} onClose={() => { this.setState({ optionsOpen: false }) }} participant={this.state.participant} index={this.props.index} />
        <StartModal open={this.state.startOpen} onClose={() => { this.setState({ startOpen: false }) }} index={this.props.index} onStart={this.props.onStart} />
      </div>
    )
  }
}
