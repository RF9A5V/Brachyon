import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import DateInput from "/imports/components/events/create/date_input.jsx";

class TierRewardCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  onTierCreate(e) {
    e.preventDefault();
    this.setState({
      open: true,
      tier: {}
    })
  }

  onTierEdit(index, tier) {
    return function(e) {
      e.preventDefault();
      this.setState({
        open: true,
        tier,
        index
      })
    }
  }

  render() {
    var tiers = typeof(this.props.tiers) == "boolean" ? [] : this.props.tiers;
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          tiers.map((tier, i) => {
            return (
              <div className="tier-block col" onClick={this.onTierEdit(i, tier).bind(this)}>

              </div>
            )
          })
        }
        <div className="tier-block col x-center" onClick={this.onTierCreate.bind(this)}>
          <div className="row center x-center" style={{padding: 20}}>
            <FontAwesome name="plus" size="2x" />
          </div>
          <span>Add a Tier</span>
        </div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({open: false}) }}>
          <div className="col">
            <label>Amount</label>
            <input type="text" style={{margin: 0, marginBottom: 10}} />
            <label>Description</label>
            <textarea></textarea>
            <label>Limit</label>
            <input type="text" style={{margin: 0, marginBottom: 10}} />
            <div className="row center">
            <button>Submit</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}


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
        {
          revenue.crowdfunding !== false || revenue.crowdfunding != null ? (
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
          revenue.tierRewards !== false || revenue.tierRewards != null ? (
            <div className="side-tab-panel col">
              <h3>Tier Rewards</h3>
              <TierRewardCollection tiers={revenue.tierRewards} />
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.stretchGoals !== false || revenue.stretchGoals != null ? (
            <div className="side-tab-panel col">
              <h3>Stretch Goals</h3>
            </div>
          ) : (
            ""
          )
        }
        {
          revenue.ticketing !== false || revenue.ticketing != null ? (
            <div className="side-tab-panel col">
              <h3>Tickets</h3>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
