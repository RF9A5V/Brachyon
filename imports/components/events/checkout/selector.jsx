import React, { Component } from "react";

import Rewards from "/imports/api/sponsorship/rewards.js";
import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";
import Games from "/imports/api/games/games.js";

export default class CheckoutSelector extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: props.startsWith == "tickets" ? "tickets" : "tiers",
      tier: props.init.tier,
      tickets: props.init.tickets
    }
  }

  tierView() {
    var tiers = Events.findOne().crowdfunding.tiers;
    return tiers.map((tier, i) => {
      var rewards = Rewards.find({ _id: { $in: tier.rewards } });
      return (
        <div className={`col checkout-selector-tier ${this.state.tier == i ? "active" : ""}`} onClick={() => {
          var value = this.state.tier == i ? -1 : i;
          this.setState({ tier: value });
          this.props.changeCart({
            tickets: this.state.tickets,
            tier: i
          })
        }}>
          <div className="row flex-pad x-center checkout-selector-tier-header">
            <h5>{ tier.name }</h5>
            <span>${(tier.price / 100).toFixed(2)}</span>
          </div>
          <div dangerouslySetInnerHTML={{__html: tier.description}} className="checkout-selector-tier-body">
          </div>
          <div className="row checkout-selector-tier-footer">
            <i>{tier.limit} remaining</i>
          </div>
          <div className="row" style={{flexWrap: "wrap"}}>
            {
              rewards.map(reward => {
                return (
                  <img src={RewardIcons.findOne(reward.img).link()} style={{width: 50, height: 50, borderRadius: "100%", marginRight: 10}} />
                )
              })
            }
          </div>
        </div>
      )
    })
  }

  ticketView() {
    var tickets = Instances.findOne().tickets;
    return Object.keys(tickets).map(key => {
      var ticket = tickets[key];
      var tickName = isNaN(key) ? key.slice(0, 1).toUpperCase() + key.slice(1) : Games.findOne(Instances.findOne().brackets[key].game).name;
      return (
        <div className={`col checkout-selector-tier ${this.state.tickets.indexOf(key) >= 0 ? "active" : ""}`} onClick={() => {
          var index = this.state.tickets.indexOf(key);
          if(index == -1) {
            this.state.tickets.push(key);
          }
          else {
            this.state.tickets.splice(index, 1);
          }
          this.props.changeCart({
            tickets: this.state.tickets,
            tier: this.state.tier
          })
          this.forceUpdate();
        }}>
          <div className="row x-center flex-pad">
            <h5>{ tickName }</h5>
            <span>${ (ticket.price / 100).toFixed(2) }</span>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div className="col col-1 checkout-selector">
        <div className="row">
          {
            Events.findOne().crowdfunding.tiers ? (
              <div className={`checkout-selector-header ${this.state.current == "tiers" ? "active" : ""}`} onClick={() => {
                this.setState({ current: "tiers" })
              }}>
                Tiers
              </div>
            ) : (
              ""
            )
          }
          {
            Instances.findOne().tickets ? (
              <div className={`checkout-selector-header ${this.state.current == "tickets" ? "active" : ""}`} onClick={() => {
                this.setState({ current: "tickets" })
              }}>
                Tickets
              </div>
            ) : (
              ""
            )
          }
        </div>
        <div className="checkout-selector-body col-1">
          {
            this.state.current == "tiers" ? (
              this.tierView()
            ) : (
              this.ticketView()
            )
          }
        </div>
      </div>
    )
  }
}
