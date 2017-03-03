import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class OnlineModal extends Component {
  render() {
    var instance = Instances.findOne();
    var ticketObj = instance.tickets;
    var venuePrice = (ticketObj.venue.price / 100);
    var entryPrice = (ticketObj[this.props.index].price / 100);

    var isOnsite = ticketObj.paymentType == "onsite" || ticketObj.paymentType == "both";
    var isOnline = ticketObj.paymentType == "online" || ticketObj.paymentType == "both";

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col center x-center" style={{height: "100%"}}>
          <p style={{margin: 10}}>
            The venue fee is ${venuePrice.toFixed(2)}. The entry fee is ${entryPrice.toFixed(2)}. Your total is ${(venuePrice + entryPrice).toFixed(2)}.
          </p>
          <div className="row center">
            {
              isOnsite ? (
                <button style={{marginRight: 10}} onClick={this.props.onAcceptOnsite}>Pay On Site</button>
              ) : (
                null
              )
            }
            {
              isOnline ? (
                <button style={{marginRight: 10}} onClick={this.props.onAcceptOnline}>Pay Online</button>
              ) : (
                null
              )
            }
            <button onClick={this.props.onClose}>Cancel</button>
          </div>
        </div>
      </Modal>
    )
  }
}
