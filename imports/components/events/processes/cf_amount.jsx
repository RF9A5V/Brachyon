import React, { Component } from "react";

export default class CrowdfundingAmount extends Component {

  value() {
    return this.state.amount;
  }

  valid() {
    if(this.state.amount == undefined) {
      toastr.error("Need to specify an amount to sponsor.");
    }
    else if(this.state.amount <= 0) {
      toastr.error("Need to specify a non-negative, greater than zero value for amount.");
    }
    else {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div>
        
      </div>
    )
  }
}
