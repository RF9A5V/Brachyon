import React, { Component } from "react";

import ProcessModal from "/imports/components/public/process_modal.jsx";
import RewardBreakdown from "./reward_breakdown.jsx";
import PaymentWrapper from "/imports/components/public/process_steps/payment_wrapper.jsx";

export default class TierPaymentContainer extends Component {
  steps() {
    return [
      {
        component: RewardBreakdown,
        args: {
          tier: this.props.tier
        }
      },
      {
        component: PaymentWrapper,
        args: {
          type: "card"
        }
      }
    ]
  }

  openModal() {
    this.refs.process.openModal();
  }

  closeModal() {
    this.refs.process.closeModal();
  }

  chargeCard(data) {
    Meteor.call("chargeCard", Events.findOne().owner, data.amount, data.token, (err) => {
      if(err){
        toastr.error("Error in processing payment");
      }
      else {
        Meteor.call("events.revenue.tiers.updateSponsor", Events.findOne()._id, this.props.index, data, (err) => {
          if(err){
            return toastr.error(err.reason, "Error!");
          }
          else {
            toastr.success("Successfully submitted payment for tier!", "Success!");
            this.closeModal();
          }
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

  render() {
    return (
      <div>
        <ProcessModal ref="process" steps={this.steps()} onComplete={this.onComplete.bind(this)} />
      </div>
    )
  }
}
