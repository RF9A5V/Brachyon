import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import DateInput from "/imports/components/events/create/date_input.jsx";
import TierRewardCollection from "./tier_rewards.jsx";
import TicketCollection from "./ticket_collection.jsx";
import StretchGoals from "./stretch.jsx";
import PrizePools from "./prize_pool.jsx";

export default class RevenuePanel extends Component {

  revenue() {
    return Events.find().fetch()[0].revenue;
  }

  render() {
    var revenue = this.revenue();
    return (
      <div className="col x-center">
        <div className="side-tab-panel col">
          <h3>Due Date</h3>
          <div>
            <DateInput init={revenue.dueDate} />
          </div>
        </div>
        <div className="side-tab-panel col">
          <h3>Prize Pools</h3>
          <PrizePools />
        </div>
        {
          revenue.crowdfunding !== false && revenue.crowdfunding != null ? (
            <div className="side-tab-panel col">
              <h3>Crowdfunding</h3>
              <h3>Requested Amount</h3>
              <input type="text" ref="amountRequested" placeholder="Minimum threshold for you to run your event." style={{margin: "0 0 10px"}} />
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.tierRewards !== false && revenue.tierRewards != null ? (
            <div className="side-tab-panel col">
              <h3>Tier Rewards</h3>
              <TierRewardCollection tiers={revenue.tierRewards} />
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.stretchGoals !== false && revenue.stretchGoals != null ? (
            <div className="side-tab-panel col">
              <h3>Stretch Goals</h3>
              <StretchGoals goals={revenue.stretchGoals}/>
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.ticketing !== false && revenue.ticketing != null ? (
            <div className="side-tab-panel col">
              <h3>Tickets</h3>
              <TicketCollection tickets={revenue.ticketing} />
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
