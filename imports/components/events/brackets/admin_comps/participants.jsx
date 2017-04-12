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

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class AddPartipantAction extends ResponsiveComponent {

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

  renderBase(opts) {
    const instance = Instances.findOne();
    const participants = instance.brackets[this.props.index].participants || [];
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
              }} />

            </div>
          )
        }
        <div className="col-3 participant-table" style={{maxHeight: opts.maxHeight, overflowY: "auto"}}>
          {
            participants.map((participant, index) => {
              const user = Meteor.users.findOne(participant.id);

              return (
                <div className="participant-row row x-center" key={index}>
                  {
                    opts.mobile ? (
                      null
                    ) : (
                      <div style={{width: "10%"}}>
                        {
                          this.state.started ? ( <div>{index+1}</div> ) :(<SeedDropDown seedIndex={index} pSize={participants.length} index={this.state.index} id={this.state.iid} updateList={this.forceUpdate.bind(this)} /> )
                        }
                      </div>
                    )
                  }
                  <img src={this.imgOrDefault(user)} style={{width: opts.imgDim, height: opts.imgDim, borderRadius: "100%", marginRight: 20}} />
                  <div className="col" style={{width: opts.mobile ? "25%" : "15%"}}>
                    <span style={{fontSize: opts.fontSize}}>{ participant.alias }</span>
                    <span style={{fontSize: `calc(${opts.fontSize} * 3 / 4)`}}>{ user ? user.username : "Anonymous" }</span>
                  </div>
                  <div className="col-1" style={{textAlign: "center"}}>
                    {
                      participant.checkedIn ? (
                        opts.mobile ? (
                          <FontAwesome name="check" style={{fontSize: `calc(${opts.fontSize} * 2)`, color: "#FF6000"}} />
                        ) : (
                          <span>Checked In</span>
                        )
                      ) : (
                        opts.mobile ? (
                          <FontAwesome name="sign-in" style={{fontSize: `calc(${opts.fontSize} * 2)`}} onClick={() => {
                            if(instance.tickets) {
                              this.setState({ discountOpen: true, participant })
                            }
                            else {
                              this.onUserCheckIn(participant);
                            }
                          }}/>
                        ) : (
                          <button className={opts.buttonClass} onClick={() => {
                            if(instance.tickets) {
                              this.setState({ discountOpen: true, participant })
                            }
                            else {
                              this.onUserCheckIn(participant);
                            }
                          }}>Check In</button>
                        )
                      )
                    }
                  </div>
                  <div style={{textAlign: "right"}}>
                    <FontAwesome name="cog" style={{cursor: "pointer", fontSize: `calc(${opts.fontSize} * 2)`}} onClick={() => { this.setState({ optionsOpen: true, participant }) }} />
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
