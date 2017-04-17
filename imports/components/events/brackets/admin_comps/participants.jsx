import React, { Component } from "react";

import ParticipantAddField from "../participant_add_field.jsx";
import TicketDiscountModal from "../ticket_discount_modal.jsx";
import OptionsModal from "./options.jsx";
import StartModal from "./start_modal.jsx";

import Instances from "/imports/api/event/instance.js";
import Brackets from "/imports/api/brackets/brackets.js";

import StartBracketAction from "./start.jsx";
import SingleParticipant from "./single_participant.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class AddPartipantAction extends ResponsiveComponent {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var iid = instance._id;
    var bracket = instance.brackets[this.props.index];
    let completed = bracket.isComplete;
    var participants = bracket.participants || [];
    this.state = {
      invisibleIndex: -1,
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
    if (this.state.invisibleIndex != hoverIndex)
      this.setState({invisibleIndex: hoverIndex});
    var { participants } = this.state;
    const dragParticipant = participants[dragIndex];

    participants.splice(dragIndex, 1);
    participants.splice(hoverIndex, 0, dragParticipant);

    this.setState({participants});
  }

  onDropEffect()
  {
    this.setState({invisibleIndex: -1});
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
    const instance = Instances.findOne();
    if(participant.id && instance.tickets) {
      Meteor.call("tickets.charge", instance._id, this.props.index, participant.id, (err) => {
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

  renderBase(opts) {
    const instance = Instances.findOne();
    return (
      <div className={opts.direction}>
        {
          this.props.bracket.isComplete ? (
            ""
          ) : (
            <div className="col col-1" style={{marginRight: opts.direction == "col" ? 0 : 20, marginBottom: opts.direction == "col" ? 30 : 0}}>
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
        <div className="col-3 participant-table" style={{maxHeight: opts.maxHeight, overflowY: "auto"}}>
          {
            this.state.participants.map((participant, index) => {
              return(<SingleParticipant participant={participant} completed={this.state.completed} index={index} invisibleIndex={this.state.invisibleIndex} openOptions={this.openOptions.bind(this)} openDiscount={this.openDiscount.bind(this)} onDropEffect={this.onDropEffect.bind(this)} onHoverEffect={this.onHoverEffect.bind(this)} opts={opts}/>);
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

  renderMobile() {
    return this.renderBase({
      direction: "col",
      mobile: true,
      fontSize: "2.5em",
      imgDim: 150,
      maxHeight: 750,
      buttonClass: "large-button"
    })
  }

  renderDesktop() {
    return this.renderBase({
      direction: "row",
      mobile: false,
      fontSize: "16px",
      imgDim: 50,
      maxHeight: 500,
      buttonClass: ""
    })
  }

}
