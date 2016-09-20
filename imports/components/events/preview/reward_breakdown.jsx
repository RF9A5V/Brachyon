import React, { Component } from "react";

export default class RewardBreakdown extends Component {

  valid() {
    return true;
  }

  value() {
    var sponsors = Events.findOne().revenue.sponsors;
    var index = -1;
    for(var i = 0; i < sponsors.length; i ++){
      if(sponsors[i].id == Meteor.userId()){
        index = i;
        break;
      }
    }
    if(i >= 0) {
      return {
        amount: (this.props.tier.price * 100) - sponsors[i].amount
      }
    }
    return {
      amount: this.props.tier.price * 100
    }
  }

  render() {
    var tier = this.props.tier;
    var revenueRewards = Events.findOne().revenue.rewards;
    var rewards = tier.rewards.map((index) => {
      return revenueRewards[index];
    });
    var sponsors = Events.findOne().revenue.sponsors;
    var index = -1;
    for(var i = 0; i < sponsors.length; i ++){
      if(sponsors[i].id == Meteor.userId()){
        index = i;
        break;
      }
    }
    return (
      <div className="col">
        <div className="row center tier-header">
          <span>{ this.props.tier.name }</span>
        </div>
        <p className="tier-description">
          { this.props.tier.description }
        </p>
        {
          rewards.map((reward) => {
            return (
              <div className="row reward-bd-block" style={{alignItems: "flex-start"}}>
                <img src={reward.imgUrl} />
                <div className="col">
                  <span>{reward.name}</span>
                  <p>
                    { reward.description }
                  </p>
                </div>
              </div>
            )
          })
        }
        <div className="row center" style={{margin: "10px 0", fontSize: "1.5em", fontWeight: "bold"}}>
          ${
            index < 0 ? (
              (this.props.tier.price).toFixed(2)
            ) : (
              (this.props.tier.price - sponsors[i].amount / 100).toFixed(2)
            )
          }
        </div>
      </div>
    )
  }
}
