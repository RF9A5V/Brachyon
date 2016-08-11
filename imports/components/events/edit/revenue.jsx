import React, { Component } from "react";

import DateInput from "/imports/components/events/create/date_input.jsx";

export default class RevenuePanel extends Component {

  revenue() {
    return Events.find().fetch()[0].revenue;
  }

  render() {
    var revenue = this.revenue();
    return (
      <div className="col x-center">
        <div className="side-tab-panel col">
          <label>Due Date</label>
          <div>
            <DateInput init={revenue.dueDate} />
          </div>
        </div>
        {
          revenue.crowdfunding !== false || revenue.crowdfunding != null ? (
            <div className="side-tab-panel col">
              <label>Crowdfunding</label>
              <label>Requested Amount</label>
              <input type="text" ref="amountRequested" placeholder="Minimum threshold for you to run your event." style={{margin: "0 0 10px"}} />
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.tierRewards !== false || revenue.tierRewards != null ? (
            <div className="side-tab-panel col">
              <label>Tier Rewards</label>
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.stretchGoals !== false || revenue.stretchGoals != null ? (
            <div className="side-tab-panel col">
              <label>Stretch Goals</label>
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.ticketing !== false || revenue.ticketing != null ? (
            <div className="side-tab-panel col">
              <label>Tickets</label>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
