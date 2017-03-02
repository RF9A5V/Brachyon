import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class OnsiteModal extends Component {

  addRSVP() {
    var instance = Instances.findOne();
    Meteor.call("tickets.addOnsite", Meteor.userId(), instance._id, this.props.index, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        this.props.onAccept();
      }
    })
  }

  render() {
    var instance = Instances.findOne();
    var ticketObj = instance.tickets;

    const venuePrice = (ticketObj["venue"].price / 100);
    const entryPrice = (ticketObj[this.props.index].price / 100);

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="row center">
          <h1>Onsite</h1>
        </div>
        <div className="row center">
          <FontAwesome name="map-marker" style={{fontSize: 64}} />
        </div>
        <p style={{margin: 10}}>
          You'll be paying on site. The venue fee is ${ venuePrice.toFixed(2) } plus ${ entryPrice.toFixed(2) } for a grand total of ${ (venuePrice + entryPrice).toFixed(2) }. Have payment ready by check in!
        </p>
        <div className="row center x-center">
          <button style={{marginRight: 20}} onClick={this.addRSVP.bind(this)}>Accept</button>
          <button>Cancel</button>
        </div>
      </Modal>
    )
  }
}
