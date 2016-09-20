import React, { Component } from "react";

import ProcessModal from "../../public/process_modal.jsx";
import TicketSelect from "./ticket_select.jsx";
import TierSelect from "./tier_select.jsx";
import PaymentWrapper from "/imports/components/public/process_steps/payment_wrapper.jsx";

export default class TicketPurchaseWrapper extends Component {

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
        if(data.index >= 0) {
          Meteor.call("events.revenue.tiers.updateSponsor", Events.findOne()._id, data.index, data, (err) => {
            if(err){
              return toastr.error(err.reason, "Error!");
            }
            else {
              Meteor.call("events.revenue.tickets.grantPrivileges", Events.findOne()._id, data.ticketList, (err) => {
                if(err){
                  return toastr.error(err.reason, "Error!");
                }
                else {
                  return toastr.success("Successfully processed payments!");
                }
              });
            }
          })
        }
        else {
          Meteor.call("events.revenue.tickets.grantPrivileges", Events.findOne()._id, data.ticketList, (err) => {
            if(err){
              return toastr.error(err.reason, "Error!");
            }
            else {
              return toastr.success("Successfully processed payments!");
            }
          });
        }
        this.closeModal();
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
        component: TicketSelect,
        args: {}
      },
      {
        component: TierSelect,
        args: {}
      },
      {
        component: PaymentWrapper,
        args: {
          type: "card",
          cb: () => {}
        }
      }
    ]
  }

  render() {
    return (
      <div>
        <ProcessModal ref="process" steps={this.steps()} onComplete={this.onComplete.bind(this)} />
      </div>
    )
  }
}
