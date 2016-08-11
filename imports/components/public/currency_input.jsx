import React, { Component } from "react";

export default class CurrencyInput extends Component {

  value() {
    return this.refs.amount.value;
  }

  render() {
    return (
      <div style={{position: "relative"}}>
        <div className="currency-symbol" style={{position: "absolute", left: 10, top: 7}}></div>
        <input type="text" ref="amount" style={{paddingLeft: 45, margin: 0}} defaultValue={this.props.amount || 0} />
      </div>
    )
  }
}
