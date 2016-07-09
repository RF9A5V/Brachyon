import React, { Component } from "react";
import Modal from 'react-modal';
import PaymentModal from "/imports/components/public/payment.jsx";

export default class TicketPanel extends Component {

  componentWillMount() {
    this.setState({
      open: false,
      price: 0
    })
  }

  openModal() {
    this.setState({
      open: true
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
  }

  render() {
    var self = this;
    if(!this.props.tickets) {
      return (
        <div></div>
      )
    }
    return (
      <div>
        {
          Object.keys(this.props.tickets).map(function(key){
            var ticket = self.props.tickets[key];
            return (
              <div className="ticket-block" onClick={() => {self.setState({open: true, price: ticket.price}); }}>
                <div className="row flex-pad x-center">
                  <b style={{fontSize: 20}}>{ ticket.name }</b>
                  <b>${ (ticket.price / 100).toFixed(2) }</b>
                </div>
                <div>
                  { ticket.description }
                </div>
                <div style={{textAlign: "right"}}>
                  <span>Limit: <i>{ticket.limit}</i></span>
                </div>
              </div>
            )
          })
        }
        <PaymentModal open={this.state.open} price={this.state.price} owner={this.props.owner} type="ticket"/>
      </div>
    )
  }
}
