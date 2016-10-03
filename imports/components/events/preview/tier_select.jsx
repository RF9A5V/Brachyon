import React, { Component } from "react";

export default class TierSelect extends Component {

  constructor(p) {
    super(p);
    this.state = {
      index: -1
    }
  }

  valid() {
    return true;
  }

  value() {
    if(this.state.index >= 0){
      return {
        tierIndex: this.state.index,
        amount: this.props.amount + (Events.findOne().crowdfunding.tiers[this.state.index].price * 100)
      }
    }
    return {

    };
  }

  onTierSelect(index) {
    return (e) => {
      var target = e.target;
      while(!target.classList.contains("tier-select")) {
        target = target.parentNode;
      }
      if(target.classList.contains("active")){
        target.classList.remove("active");
        this.state.index = -1;
      }
      else {
        var query = document.querySelectorAll(".tier-select.active");
        for(var i = 0; i < query.length; i ++){
          query[i].classList.remove("active");
        }
        target.classList.add("active");
        this.state.index = index;
      }
    }
  }

  render() {
    var tiers = Events.findOne().crowdfunding.tiers;
    return (
      <div className="tier-select-container">
        <h3>But Wait, There's More!</h3>
        <span>Before you check out, check out these crowdfunding rewards! You don't have to buy any, but they're pretty awesome.</span>
        {
          tiers.map((tier, index) => {
            return (
              <div className="tier-select" onClick={this.onTierSelect(index).bind(this)}>
                <div className="row x-center flex-pad">
                  <span>
                    { tier.name }
                  </span>
                  <span>
                    ${ tier.price }
                  </span>
                </div>
                <p>
                  { tier.description }
                </p>
              </div>
            )
          })
        }
      </div>
    )
  }
}
