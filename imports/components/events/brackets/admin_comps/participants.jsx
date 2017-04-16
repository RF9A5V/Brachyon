import React, { Component } from "react";

import ParticipantAddField from "../participant_add_field.jsx";
import TicketDiscountModal from "../ticket_discount_modal.jsx";
import OptionsModal from "./options.jsx";
import StartModal from "./start_modal.jsx";

import Instances from "/imports/api/event/instance.js";
import Brackets from "/imports/api/brackets/brackets.js";

import StartBracketAction from "./start.jsx";
import SingleParticipant from "./single_participant.jsx";

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class AddParticipantAction extends Component {

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

  openDiscount(participant) {
    if(instance.tickets) {
      this.setState({ discountOpen: true, participant })
    }
    else {
      this.onUserCheckIn(participant);
    }
  }

  onHoverEffect(dragIndex, hoverIndex)
  {
    var { participants } = this.state;
    const dragParticipant = participants[dragIndex];

    participants.splice(dragIndex, 1);
    participants.splice(hoverIndex, 0, dragParticipant);

    this.setState({participants});
  }

  onDropEffect()
  {
    Meteor.call("participants.updateParticipants", Instances.findOne()._id, this.props.index, this.state.participants, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully switched seeding!");
      }
    })
  }

  openOptions(participant) { this.setState({ optionsOpen: true, participant }) }

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

  updateParticipants() {
    this.setState({
      participants: Instances.findOne().brackets[this.props.index].participants
    })
  }

  render() {
    const instance = Instances.findOne();
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
              }} onUpdateParticipants={this.updateParticipants.bind(this)} />
            </div>
          )
        }
        <div className="col-3 participant-table" style={{maxHeight: 500, overflowY: "auto"}}>
          {
            this.state.participants.map((participant, index) => {
              return(<SingleParticipant participant={participant} index={index} openOptions={this.openOptions.bind(this)} openDiscount={this.openDiscount.bind(this)} onDropEffect={this.onDropEffect.bind(this)} onHoverEffect={this.onHoverEffect.bind(this)}/>);
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

export default DragDropContext(HTML5Backend)(AddParticipantAction)
