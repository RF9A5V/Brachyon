import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Goals from "./stretch.jsx";
import PaymentContainer from "../crowdfunding/payment_container.jsx";

export default class CrowdfundingPanel extends Component {

  constructor(props){
    super(props);
    this.state = {
      open: false,
      helpOpen: false,
      price: 0
    }
  }

  openModal() {
    this.refs.wrapper.openModal();
  }

  setGoal(goal){
    return (e) => {
      console.log(goal);
      this.setState({
        goal
      })
    }
  }

  render() {
    var event = Events.findOne();
    var percent = 0;
    if(event.revenue.crowdfunding.amount) {
      percent = Math.min((event.revenue.crowdfunding.current || 0) / event.revenue.crowdfunding.amount * 100, 100);
    }
    return (
      <div className="row">
        <div className="col-2" style={{padding: 20}}>
          {
            event.revenue.stretchGoals != null && event.revenue.stretchGoals.length > 0 ? (
              <div className="col x-center">
                <h3 style={{marginBottom: 20}}>Stretch Goals</h3>
                <Goals goals={event.revenue.stretchGoals} onGoalSelect={this.setGoal.bind(this)} />
              </div>
            ) : (
              ""
            )
          }
        </div>
        <div className="col-1" style={{padding: 20}}>

          <div className="row" style={{width: "100%", backgroundColor: "#111", border: "solid 2px white", boxSizing: "border-box", marginBottom: 10}}>
            <div style={{backgroundColor: "#0C0", width: percent + "%", height: 30}}></div>
          </div>
          <div className="col x-center">
            {
              typeof(event.revenue.tierRewards) == "object" && event.revenue.tierRewards != null ? (
                event.revenue.tierRewards.map((tier, index) => {
                  return (
                    <div className="tier-display-block" style={{padding: 10, backgroundColor: "#111", margin: 10, marginTop: 0, width: "100%"}} onClick={this.openModal.bind(this)}>
                      <div className="row x-center flex-pad" style={{marginBottom: 10}}>
                        <h3>{(tier.amount / 100).toLocaleString("en-US", { style: "currency", currency: "USD" })}</h3>
                        <span>{ tier.limit.toLocaleString() } available</span>
                      </div>
                      <p>
                        {
                          tier.description
                        }
                      </p>
                    </div>
                  )
                })
              ) : (
                "No Tiers Found"
              )
            }
          </div>
        </div>
        <PaymentContainer ref="wrapper" />
      </div>
    );
  }
}
