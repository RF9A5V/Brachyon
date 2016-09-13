import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class MoneyInput extends Component {

  currencySymbol() {
    return (
      <FontAwesome name="usd" size="2x" className="currency-symbol" />
    )
  }

  value() {
    return parseFloat(this.refs.amount.value);
  }

  verifyValidAmount(e) {
    var amount = e.target.value;
    var numDots = (amount.match(/\./g) || []).length;
    if(numDots > 1 || isNaN(amount)) {
      this.refs.amount.value = e.target.value.slice(0, -1);
    }
  }

  formatAmount(e) {
    this.refs.amount.value = parseFloat(e.target.value).toFixed(2);
  }

  render() {
    return (
      <div className="currency-input-container">
        { this.currencySymbol() }
        <input type="text" ref="amount" onChange={this.verifyValidAmount.bind(this)} defaultValue="0.00" onBlur={this.formatAmount.bind(this)} defaultValue={(this.props.defaultValue / 100 || 0).toFixed(2)} />
      </div>
    )
  }
}
