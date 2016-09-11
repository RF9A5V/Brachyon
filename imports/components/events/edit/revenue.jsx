import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import DateInput from "/imports/components/events/create/date_input.jsx";
import TierRewardCollection from "./tier_rewards.jsx";
import TicketCollection from "./ticket_collection.jsx";
import StretchGoals from "./stretch.jsx";
import PrizePools from "./prize_pool.jsx";

import MoneyInput from "/imports/components/public/money_input.jsx";

export default class RevenuePanel extends Component {

  revenue() {
    return Events.find().fetch()[0].revenue;
  }

  savePrizePool(e) {
    e.preventDefault();
    var breakdown = this.refs.prizePools.value();
    Meteor.call("events.savePrizePool", Events.findOne()._id, breakdown, function(err) {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully updated your prize pool.", "Success!");
      }
    })
  }

  saveCFDetails() {
    Meteor.call("events.saveCFDetails", Events.findOne()._id, this.refs.dueDate.value(), this.refs.amountRequested.value(), (err) => {
      if(err){
        return toastr.error("Couldn't update CF information.", "Error!");
      }
      else {
        toastr.success("Successfully updated CF information.", "Success!");
      }
    });
  }

  render() {
    var revenue = this.revenue();
    return (
      <div className="col x-center">
        <div className="side-tab-panel col">
          <div className="row" style={{justifyContent: "flex-end"}}>
            <button onClick={this.saveCFDetails.bind(this)}>Save</button>
          </div>
          <h3 style={{marginBottom: 10}}>Due Date</h3>
          <div style={{marginBottom: 10}}>
            <DateInput init={revenue.crowdfunding.dueDate} ref="dueDate" />
          </div>
          <h3 style={{marginBottom: 10}}>Requested Amount</h3>
          <div style={{marginBottom: 10}}>
            <MoneyInput ref="amountRequested" defaultValue={revenue.crowdfunding.amount}/>
          </div>
        </div>
        <div className="side-tab-panel col">
          <div className="row x-center flex-pad">
            <h3>Prize Pools</h3>
            <button onClick={this.savePrizePool.bind(this)}>Save</button>
          </div>
          <PrizePools ref="prizePools" />
        </div>
        {
          revenue.tierRewards != null ? (
            <div className="side-tab-panel col">
              <h3>Tier Rewards</h3>
              <TierRewardCollection tiers={revenue.tierRewards} />
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.stretchGoals != null ? (
            <div className="side-tab-panel col">
              <h3>Stretch Goals</h3>
              <StretchGoals goals={revenue.stretchGoals}/>
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.ticketing != null ? (
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
