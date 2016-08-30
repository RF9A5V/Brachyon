import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class PaymentType extends Component {

  constructor() {
    super();
    this.state = {};
  }

  value() {
    return {
      paymentType: this.state.option
    }
  }

  valid() {
    if(this.state.option == undefined) {
      toastr.error("No option selected.");
      return false;
    }
    if(this.state.option == "wallet" || this.state.option == "paypal" || this.state.option == "bitcoin") {
      toastr.error("Payment method hasn't been implemented yet!");
      return false;
    }
    return true;
  }

  onOptionSelect(option) {
    return (e) => {
      e.preventDefault();
      this.setState({
        option
      });
    }
  }

  render() {
    return (
      <div className="row">
        <div className={`payment-option-block col center ${this.state.option == "card" ? "active" : ""}`} onClick={this.onOptionSelect("card").bind(this)}>
          <FontAwesome name="credit-card" size="3x"/>
          <span className="payment-option-text">Card</span>
        </div>
        <div className={`payment-option-block col center ${this.state.option == "wallet" ? "active" : ""}`} onClick={this.onOptionSelect("wallet").bind(this)}>
          <FontAwesome name="shopping-cart" size="3x"/>
          <span className="payment-option-text">Wallet</span>
        </div>
        <div className={`payment-option-block col center ${this.state.option == "paypal" ? "active" : ""}`} onClick={this.onOptionSelect("paypal").bind(this)}>
          <FontAwesome name="paypal" size="3x"/>
          <span className="payment-option-text">Paypal</span>
        </div>
        <div className={`payment-option-block col center ${this.state.option == "bitcoin" ? "active" : ""}`} onClick={this.onOptionSelect("bitcoin").bind(this)}>
          <FontAwesome name="btc" size="3x"/>
          <span className="payment-option-text">Bitcoin</span>
        </div>
      </div>
    )
  }
}
