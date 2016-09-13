import React, { Component } from "react";

import ProcessModal from "../../public/process_modal.jsx";
import PaymentType from "../../public/process_steps/payment_type.jsx";
import CFAmount from "../processes/cf_amount.jsx";
import PaymentWrapper from "../../public/process_steps/payment_wrapper.jsx";

export default class PaymentContainer extends Component {

  chargeCard(data) {
    Meteor.call("chargeCard", Events.findOne().owner, data.amount, data.token, (err) => {
      if(err){
        toastr.error("Error in processing payment");
      }
      else {
        Meteor.call("events.updatePayment", Events.findOne()._id, data.baseAmount, data.comment, (err) => {
          if(err){
            return toastr.error(err.reason, "Error!");
          }
          toastr.success("Successfully received payment!");
          this.closeModal();
        });
      }
    })
  }

  onComplete(data) {
    if(data.addCard){
      Meteor.call("addCard", data.token, (err) => {
        if(err){
          toastr.error("Couldn't charge card.");
        }
        else {
          this.chargeCard(data);
        }
      })
    }
    else {
      this.chargeCard(data);
    }
  }

  steps() {
    return [
      {
        component: PaymentType,
        args: {}
      },
      {
        component: CFAmount,
        args: { revenue: Events.findOne().revenue }
      },
      {
        component: PaymentWrapper,
        args: { type: "card" }
      }
    ]
  }

  openModal() {
    this.refs.process.openModal();
  }

  closeModal() {
    this.refs.process.closeModal();
  }

  render() {
    return (
      <div>
        <ProcessModal ref="process" onComplete={this.onComplete.bind(this)} steps={this.steps()} />
      </div>
    )
  }
}
