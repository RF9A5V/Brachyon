import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import Goals from "./stretch.jsx";
import Payment from "/imports/components/public/payment_process.jsx";

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
    this.setState({
      open: true
    });
  }

  closeModal() {
    this.setState({
      open: false
    });
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
    if(this.state.goal) {
      percent = Math.min((this.state.goal.current || 0) / this.state.goal.amount * 100, 100);
    }
    console.log(percent);
    return (
      <div className="row">
        <div className="col-2" style={{padding: 20}}>
          <div className="row center">
          <h3 style={{marginBottom: 20}}>Stretch Goals</h3>
          </div>
          <Goals goals={Events.findOne().revenue.stretchGoals} onGoalSelect={this.setGoal.bind(this)} />
        </div>
        <div className="col-1" style={{padding: 20}}>
          <h3>{ this.state.goal ? this.state.goal.name : "" }</h3>
          {
            this.state.goal ? (
              <span>{ ((this.state.goal.current || 0) / 100).toFixed(2) } / { (this.state.goal.amount / 100).toFixed(2) }</span>
            ) : (
              ""
            )
          }

          <div className="row" style={{width: "100%", backgroundColor: "#111", border: "solid 2px white", boxSizing: "border-box", marginBottom: 10}}>
            <div style={{backgroundColor: "#0C0", width: percent + "%", height: 30}}></div>
          </div>
          <div className="col x-center">
            {
              typeof(event.revenue.tierRewards) == "object" && event.revenue.tierRewards != null ? (
                event.revenue.tierRewards.map((tier, index) => {
                  return (
                    <div className="tier-display-block" style={{padding: 10, backgroundColor: "#111", margin: 10, marginTop: 0, width: "100%"}} onClick={() => { this.setState({ open: true, price: tier.amount, index: index }) }}>
                      <div className="row x-center flex-pad" style={{marginBottom: 10}}>
                        <h3>${(tier.amount / 100).toFixed(2)}</h3>
                        <span>{ tier.limit } available</span>
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
        <Modal isOpen={this.state.open} onRequestClose={this.closeModal.bind(this)}>
          <Payment price={this.state.price} index={this.state.index} closeHandler={this.closeModal.bind(this)} />
        </Modal>
      </div>
    );
  }
}
