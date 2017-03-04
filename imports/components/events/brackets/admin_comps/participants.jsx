import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import ParticipantAddField from "../participant_add_field.jsx";
import TicketDiscountModal from "../ticket_discount_modal.jsx";
import OptionsModal from "./options.jsx";

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
      index: this.props.index,
      discountOpen: false,
      optionsOpen: false
    }
  }

  imgOrDefault(user) {
    return user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png";
  }

  onUserCheckIn(participant) {
    Meteor.call("events.checkInUser", Events.findOne()._id, this.props.index, participant.alias, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully checked in user!");
      }
    })
  }

  render() {
    const instance = Instances.findOne();
    const participants = instance.brackets[this.props.index].participants;
    return (
      <div className="row">
        {
          this.props.bracket.isComplete ? (
            ""
          ) : (
            <div className="col col-1" style={{marginRight: 20}}>
              <ParticipantAddField index={this.props.index} bracket={this.props.bracket} onStart={this.props.onStart} onParticipantAdd={(p) => {
                this.setState({
                  participant: p,
                  discountOpen: true
                })
              }} />

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
      </div>
    )
  }
}
