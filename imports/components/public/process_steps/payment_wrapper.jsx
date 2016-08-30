import React, { Component } from "react";

import CardPayment from "./card_payment.jsx";

export default class PaymentWrapper extends Component {

  value() {
    this.refs[this.props.type].value();
  }

  paymentType() {
    if(this.props.type == "card") {
      return (
        <CardPayment ref={this.props.type} amount={this.props.amount} cb={this.props.cb}/>
      );
    }
    return (
      <div></div>
    );
  }

  render() {
    return (
      <div>
        {
          this.paymentType()
        }
      </div>
    )
  }
}
