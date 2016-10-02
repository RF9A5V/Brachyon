import React, { Component } from "react";

import CardPayment from '/imports/components/public/process_steps/card_payment.jsx';

export default class PaymentCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  isValid() {
    return this.refs.card.isValid();
  }

  value(cb) {
    this.refs.card.value(cb);
  }

  setItems(obj) {
    for(var i in obj) {
      this.state[i] = obj[i];
    }
    this.forceUpdate();
  }

  ticketName(ticket) {
    var event = Events.findOne();
    if(isNaN(parseInt(ticket))) {
      return ticket[0].toUpperCase() + ticket.slice(1);
    }
    return "Entry to " + event.brackets[parseInt(ticket)].name
  }

  render() {
    var event = Events.findOne();
    var tickets = event.tickets;
    var tiers = event.crowdfunding.tiers;
    return (
      <div className="col" style={{padding: 20}}>
        <div className="row center" style={{marginBottom: 20}}>
          <h3>Payment</h3>
        </div>
        <div className="row">
          <div className="col-1">
          </div>
          <div className="submodule-section">
            <CardPayment amount={this.props.price * 100} payableTo={event.owner} cb={() => {}} ref="card"/>
          </div>
          <div className="submodule-section col-2">
            <div>
              {
                this.props.ticketList && this.props.ticketList.length > 0 ? (
                  <div>
                    <div className="row center">
                      <h3>Tickets</h3>
                    </div>
                    {
                      this.props.ticketList.map((key, index) => {
                        var ticket = tickets[key];
                        return (
                          <div className="row flex-pad x-center" style={{paddingBottom: 20}}>
                            <h5>{ this.ticketName(key) }</h5>
                            <h5>${ ticket.price }</h5>
                          </div>
                        )
                      })
                    }
                  </div>
                ) : (
                  ""
                )
              }
              {
                this.props.tierIndex >= 0 ? (
                  <div className="col">
                    <div className="row center">
                      <h3>Tiers</h3>
                    </div>
                    <div className="row flex-pad">
                      <h5>Tier at ${tiers[this.props.tierIndex].price}</h5>
                      <h5>${tiers[this.props.tierIndex].price}</h5>
                    </div>
                  </div>
                ) : (
                  ""
                )
              }
            </div>
          </div>
          <div className="col-1">
          </div>
        </div>
      </div>
    )
  }
}
