import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class OnlineModal extends Component {
  render() {

    var instance = Instances.findOne();
    var ticketObj = instance.tickets;
    var venuePrice = (ticketObj.venue.price / 100);
    var entryPrice = (ticketObj[this.props.index].price / 100);

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="row center">
          <h1>Online</h1>
        </div>
        <div className="row center">
          <FontAwesome name="signal" style={{fontSize: 40}} />
        </div>
        <p style={{margin: 10}}>
          You will be paying online. The venue fee is ${venuePrice.toFixed(2)}. The entry fee is ${entryPrice.toFixed(2)}. Your total is ${(venuePrice + entryPrice).toFixed(2)}.
        </p>
        <div className="row center">
          <button style={{marginRight: 10}} onClick={this.props.onAccept}>Accept</button>
          <button onClick={this.props.onClose}>Cancel</button>
        </div>
      </Modal>
    )
  }
}
