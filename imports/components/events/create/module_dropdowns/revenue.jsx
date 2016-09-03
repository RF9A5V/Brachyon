import React, { Component } from "react";

export default class RevenuePanel extends Component {

  value() {
    return {
      crowdfunding: this.refs.crowdfunding.checked ? {} : null,
      tierRewards: this.refs.tierRewards.checked ? [] : null,
      stretchGoals: this.refs.stretchGoals.checked ? [] : null,
      ticketing: this.refs.ticketing.checked ? [] : null
    };
  }

  render() {
    return (
      <div>
        <div className="row x-center">
          <input type="checkbox" checked={true} />
          <span>Prize Pool</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" ref="crowdfunding" />
          <span>Crowdfunding</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" ref="tierRewards" />
          <span>Tier Rewards</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" ref="stretchGoals" />
          <span>Stretch Goals</span>
        </div>
        <div>
          <input type="checkbox" ref="ticketing" />
          <span>Ticketing</span>
        </div>
      </div>
    )
  }
}
