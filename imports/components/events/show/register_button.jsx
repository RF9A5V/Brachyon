import React, { Component } from "react";

import OnsiteModal from "./onsite_modal.jsx";

export default class RegisterButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      onsiteOpen: false,
      onlineOpen: false,
      paymentOpen: false
    }
  }

  registerCB() {
    Meteor.call("events.registerUser", Events.findOne()._id, this.props.metaIndex, Meteor.userId(), (e) => {
      if(e) {
        toastr.error(e.reason);
      }
      else {
        toastr.success("Successfully registered for bracket!");
        this.setState({
          onsiteOpen: false,
          onlineOpne: false,
          paymentOpen: false
        })
      }
    })
  }

  register() {
    var instance = Instances.findOne();
    if(instance.tickets) {
      if(instance.tickets.paymentType == "onsite") {
        this.setState({
          onsiteOpen: true
        })
      }
    }
    else {
      this.registerCB();
    }
  }

  unregisterCB() {
    Meteor.call("events.removeParticipant", Events.findOne()._id, this.props.metaIndex, Meteor.userId(), (e) => {
      if(e) {
        toastr.error(e.reason);
      }
      else {
        toastr.success("Successfully unregistered for bracket!");
        this.forceUpdate();
      }
    })
  }

  unregister() {
    var instance = Instances.findOne();
    if(instance.tickets) {
      Meteor.call("tickets.removePayment", instance._id, this.props.metaIndex, Meteor.userId(), (err) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          this.unregisterCB();
        }
      });
    }
    else {
      this.unregisterCB();
    }

  }

  render() {
    var pIndex = (this.props.bracketMeta.participants || []).findIndex((p) => {
      return p.id == Meteor.userId();
    });
    var instance = Instances.findOne();
    return (
      <div>
        <button style={this.props.style} onClick={() => {
          pIndex >= 0 ? this.unregister() : this.register();
        }}>
          {
            pIndex >= 0 ? (
              "Unregister"
            ) : (
              "Register"
            )
          }
        </button>
        {
          instance.tickets ? (
            [
              <OnsiteModal open={this.state.onsiteOpen} onClose={() => { this.setState({onsiteOpen: false}) }} index={this.props.metaIndex} onAccept={this.registerCB.bind(this)} />
            ]
          ) : (
            ""
          )
        }

      </div>
    )
  }
}
