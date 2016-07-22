import React, { Component } from "react";

import PaymentModal from "./payment.jsx";

export default class CurrencyPurchaseScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 0
    }
  }

  amountRequest(value) {
    return function(e) {
      e.preventDefault();
      this.setState({
        value,
        open: true
      })
      // For now, spoof the payment stuff.
      // Meteor.call("users.purchase_currency", value, function(err) {
      //   if(err){
      //     toastr.error(err.reason);
      //   }
      //   else {
      //     toastr.success(`Successfully added ${value} to your wallet!`, "Success!");
      //   }
      // })
    }
  }

  amounts() {
    return [1, 5, 10, 20, 50, 100].map((value) => {
      return (
        <div className="col-1" style={{padding: 10}}>
          <div className="col x-center currency-option" onClick={this.amountRequest(value * 100).bind(this)}>
            <b>${value.toFixed(2)}<sup>*</sup></b>
            <div className="row x-center" style={{marginTop: 20}}>
              <div style={{width: 25, height: 25, backgroundColor: "gold", marginRight: 10, borderRadius: "100%"}}></div>
              { (value * 100).toLocaleString() }
            </div>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="box" style={{padding: "0 20px 10px"}}>
        <h3>Get $CURRENCY_NAME</h3>
        <div>
          <h3 style={{textAlign: "center"}}>Buy Credits</h3>
          <div className="row col-1">
            { this.amounts() }
          </div>
          <sub>*Payment processing fee not included.</sub>
        </div>
        <div className="col x-center">
          <h3 style={{textAlign: "center"}}>Watch Ads for Credits</h3>
          <div style={{width: 400, height: 400, backgroundColor: "#111"}} className="row center x-center">
            <span>1:1 Graphic Goes Here!</span>
          </div>
        </div>
        <PaymentModal type="tier" price={this.state.value} open={this.state.open}/>
      </div>
    )
  }
}
