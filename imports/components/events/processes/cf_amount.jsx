import React, { Component } from "react";

export default class CrowdfundingAmount extends Component {

  constructor(props) {
    super(props);
    this.state = {
      amount: 0
    }
  }

  value() {
    return {
      amount: this.state.amount,
      comment: this.refs.comment.value
    };
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

  nextAvailableReward() {
    var revenue = this.props.revenue;
    var futureTierIndex = 0;
    while(futureTierIndex < revenue.tierRewards.length && this.state.amount >= revenue.tierRewards[futureTierIndex].amount) {
      futureTierIndex ++;
    }
    var currentTier = revenue.tierRewards[futureTierIndex - 1];
    var afterTier = revenue.tierRewards[futureTierIndex];
    return (
      <div className="col" style={{marginBottom: 20}}>
        <h3>Tier Rewards</h3>
        <div className="row center" style={{alignItems: "flex-end"}}>
          {
            currentTier != undefined ? (
              <div className="tier-block col">
                <div className="row flex-pad" style={{marginBottom: 20}}>
                  <span>
                    ${(currentTier.amount / 100).toFixed(2)}
                  </span>
                  <span>
                    Limit of {currentTier.limit}
                  </span>
                </div>

                {
                  currentTier.description
                }
              </div>
            ) : (
              ""
            )
          }
          {
            afterTier != undefined ? (
              <div className="col" style={{alignItems: "flex-start"}}>
                <span style={{marginBottom: 5}}>
                  {
                    "$" + ((afterTier.amount - this.state.amount) / 100).toLocaleString() + " until"
                  }
                </span>
                <div className="tier-block col">
                  <div className="row flex-pad" style={{marginBottom: 20}}>
                    <span>
                      ${(afterTier.amount / 100).toFixed(2)}
                    </span>
                    <span>
                      Limit of {afterTier.limit}
                    </span>
                  </div>
                  {
                    afterTier.description
                  }
                </div>
              </div>
            ) : (
              ""
            )
          }
        </div>
        <h3 style={{marginBottom: 10}}>Skill Points</h3>
        <span>
          ${((revenue.stretchGoalThreshold || 1000) / 100).toFixed(2)} per skill point for
          <span style={{marginLeft: 5}}>
            <span style={{fontSize: 28}}>{parseInt(this.state.amount / (revenue.stretchGoalThreshold || 1000))}</span> more skill points.
          </span>
        </span>
      </div>
    )
  }

  updateAmount() {
    this.setState({
      amount: this.refs.amount.value * 100
    });
  }

  render() {
    return (
      <div className="col">
        <input type="number" ref="amount" onChange={this.updateAmount.bind(this)} />
        <textarea ref="comment" placeholder="Enter a comment (optional)."></textarea>
        {
          this.nextAvailableReward()
        }
      </div>
    )
  }
}
