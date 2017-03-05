import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class OnlineModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appliedDiscounts: {},
      failedState: false
    }
  }

  render() {
    const instance = Instances.findOne();
    const ticketObj = instance.tickets;
    const venuePrice = (ticketObj.venue.price / 100);
    const entryTick = ticketObj[this.props.index];
    const entryPrice = (entryTick.price / 100);

    const isOnsite = ticketObj.paymentType == "onsite" || ticketObj.paymentType == "both";
    const isOnline = ticketObj.paymentType == "online" || ticketObj.paymentType == "both";

    const totalDiscounts = Object.keys(this.state.appliedDiscounts).map(i => {
      return entryTick.discounts[i].price
    }).reduce((a, b) => { return a + b }, 0) / 100;

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col center x-center" style={{height: "100%"}}>
          <p style={{margin: 10}}>
            The venue fee is ${venuePrice.toFixed(2)}. The entry fee is ${entryPrice.toFixed(2)}. Your total is ${(venuePrice + entryPrice).toFixed(2)}.
          </p>
          {
            entryTick.discounts.map((discount, i) => {
              return (
                <div className="row center x-center" style={{marginBottom: 10}}>
                  <input type="checkbox" style={{margin: 0, marginRight: 10}} onChange={e => {
                    if(e.target.checked) {
                      this.state.appliedDiscounts[i] = 1;
                    }
                    else {
                      delete this.state.appliedDiscounts[i];
                    }
                    this.forceUpdate();
                  }} />
                  <span>{ discount.name } Discount At ${(discount.price / 100).toFixed(2)} off</span>
                </div>
              )
            })
          }
          {
            Object.keys(this.state.appliedDiscounts).length > 0 ? (
              <div style={{marginBottom: 10}}>
                <span>
                  Total of ${
                    (totalDiscounts).toFixed(2)
                  } in discounts. New total is ${(venuePrice + entryPrice - totalDiscounts).toFixed(2)}
                </span>
              </div>
            ) : (
              null
            )
          }
          <div className="row center">
            {
              isOnsite ? (
                <button style={{marginRight: 10}} onClick={() => { this.props.onAcceptOnsite(Object.keys(this.state.appliedDiscounts)) }}>Pay On Site</button>
              ) : (
                null
              )
            }
            {
              isOnline ? (
                <button style={{marginRight: 10}} onClick={() => { this.props.onAcceptOnline(Object.keys(this.state.appliedDiscounts)) }}>Pay Online</button>
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
