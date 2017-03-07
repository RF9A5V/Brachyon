import React, { Component } from "react";

import TicketTypeModal from "./ticket_type_modal.jsx";
import PaymentModal from "/imports/components/public/payment_form.jsx";

export default class RegisterButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typeOpen: false,
      paymentOpen: false
    }
  }

  registerCB(index) {
    Meteor.call("events.registerUser", Events.findOne()._id, index, Meteor.userId(), (e) => {
      if(e) {
        toastr.error(e.reason);
      }
      else {
        toastr.success("Successfully registered for bracket!");
        this.setState({
          typeOpen: false,
          paymentOpen: false
        })
      }
    })
  }

  register() {
    var instance = Instances.findOne();
    if(instance.tickets) {
      this.setState({
        typeOpen: true
      })
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

  paymentItems() {
    var instance = Instances.findOne();
    return [
      {
        name: "Venue Fee",
        price: instance.tickets.venue.price
      },
      {
        name: "Entry to Bracket " + this.props.metaIndex,
        price: instance.tickets[this.props.metaIndex].price
      }
    ]
  }

  processPayment(value, amount, cb) {

    const setPayable = (token) => {
      Meteor.call("tickets.addOnline", Meteor.userId(), Instances.findOne()._id, this.props.metaIndex, token, (err) => {
        if(err) {
          return toastr.error(err.reason);
        }
        else {
          this.registerCB();
        }
      })
    }

    if(!value.id) {
      Meteor.call("users.addStripeSource", Meteor.userId(), value, (err, data) => {
        if(err) {
          toastr.error(err.reason);
        }
        else {
          this.setState({
            paymentOpen: false
          });
          setPayable(data);
        }
        cb();
      })
    }
    else {
      setPayable(value.id);
      cb();
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
              <TicketTypeModal open={this.state.typeOpen} onClose={() => { this.setState({typeOpen: false}) }} index={this.props.metaIndex} onAcceptOnsite={(tickets) => {
                Meteor.call("tickets.addOnsite", Meteor.userId(), Instances.findOne()._id, tickets, (err) => {
                  if(err) {
                    return toastr.error(err.reason);
                  }
                  else {
                    const instance = Instances.findOne();
                    Object.keys(tickets).forEach(k => {
                      if(!isNaN(k) && pIndex < 0) {
                        this.registerCB(parseInt(k))
                      }
                    });
                    this.forceUpdate();
                  }
                })
              }} onAcceptOnline={(tickets, discounts) => {
                this.setState({
                  typeOpen: false,
                  paymentOpen: true,
                  tickets,
                  discounts
                })
              }} />,
              <PaymentModal open={this.state.paymentOpen} onClose={() => { this.setState({ paymentOpen: false }) }} items={this.paymentItems()} submit={this.processPayment.bind(this)} discounts={(this.state.discounts || []).map(d => {
                return instance.tickets[this.props.metaIndex].discounts[d];
              })} />
            ]
          ) : (
            ""
          )
        }

      </div>
    )
  }
}
