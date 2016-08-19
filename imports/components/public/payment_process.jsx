import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import SliderBars from "/imports/components/public/sliders.jsx";
import CCForm from "/imports/components/public/credit_card.jsx";

export default class PaymentProcess extends Component {

  constructor(props) {
    super(props);
    var pools = Events.findOne().organize.map((bracket, index) => {
      return {
        name: "Prize Pool for " + bracket.name,
        deletable: false,
        poolID: index
      }
    })
    this.state = {
      step: 0,
      option: null,
      labels: pools
    };
  }

  onGoalSelect() {
    var goals = Events.findOne().revenue.stretchGoals;
    var goal = goals[this.refs.goalSelect.value];
    this.state.labels.push({
      name: goal.name,
      deletable: true,
      index: this.refs.goalSelect.value
    });
    this.forceUpdate();
  }

  openGoals() {
    var goals = Events.findOne().revenue.stretchGoals;
    if(goals == null || typeof(goals) == "boolean") {
      return [];
    }
    var open = [0];
    var count = 0;
    while(count < open.length) {
      var goal = goals[open[count]];
      var containsLabel = this.state.labels.some((label) => {
        return label.index == open[count];
      });
      if(containsLabel){
        open = open.slice(1);
      }
      else if(goal.current >= goal.amount) {
        open = open.slice(1).concat(goal.children);
      }
      count += 1;
    }
    if(open.length == 0){
      return (
        <span>
          No more goals to contribute to!
        </span>
      )
    }
    return (
      <select ref="goalSelect" value="" onChange={this.onGoalSelect.bind(this)}>
        <option value="" disabled={true}>Select a goal</option>
        {
          open.map((key) => {
            return (
              <option value={key}>
                { goals[key].name }
              </option>
            )
          })
        }
      </select>
    )
  }

  updatePaymentValues() {
    var self = this;
    Meteor.call("events.updatePaymentValues", Meteor.userId(), Events.findOne()._id, this.state.breakdown, this.props.price, (err) => {
      if(err){
        toastr.error("Couldn't update fields for crowdfunding.", "Error!");
      }
      else {
        toastr.success("Successfully processed payment!", "Success!");
        self.props.closeHander();
      }
    })
  }

  render() {
    var step = this.state.step;
    var option = this.state.option;
    if(step === 0) {
      return (
        <div className="col" style={{height: "100%"}}>
          <div className="row" style={{height: "100%"}}>
            <div className="col col-1 center x-center payment-option" style={{padding: 20}} onClick={() => {
              this.setState({ step: 1, option: 0 })
            }}>
              <FontAwesome name="shopping-cart" size="4x"  style={{marginBottom: 20}} />
              <span>Pay from Wallet</span>
            </div>
            <div className="col col-1 center x-center payment-option" style={{padding: 20}} onClick={() => {
              this.setState({ step: 1, option: 1 })
            }}>
              <FontAwesome name="credit-card" size="4x" style={{marginBottom: 20}} />
              <span>Pay with Card</span>
            </div>
          </div>
        </div>
      );
    }
    else if (step === 1) {
      return (
        <div className="col center x-center">
          <div className="row">
            <button onClick={() => { this.setState({ step: 0, options: null })}}>Back</button>
          </div>
          <SliderBars labels={this.state.labels} onRemove={(index) => {
            (e) => {
              this.state.labels.splice(index, 1);
              this.forceUpdate();
            }
          }} value={this.props.price / 100} ref="breakdown"/>
          {
            this.openGoals()
          }
          <button onClick={() => {
            this.setState({
              breakdown: this.refs.breakdown.values(),
              step: 2
            })
          }}>Save Breakdown</button>
        </div>
      )
    }
    else {
      if(option === 0) {
        var walletAmount = (Meteor.user().profile.amount || 0) / 100;
        var price = this.props.price / 100;
        var amount = walletAmount - price;
        return (
          <div className="col center" style={{height: "100%"}}>
            <div className="row">
              <button onClick={() => { this.setState({ step: 1 }) }}>Back</button>
            </div>
            <div className="row center x-center" style={{marginBottom: 20}}>
              <div className="col" style={{alignItems: "flex-end"}}>
                <span className="payment-amount">${ walletAmount.toFixed(2) }</span>
                <span className="payment-amount">- ${ price.toFixed(2) }</span>
                <span className="payment-amount">{amount < 0 ? "-" : ""} ${ Math.abs(amount).toFixed(2) }</span>
              </div>
              <div className="col center" style={{alignItems: "flex-start", marginLeft: 20}}>
                <span className="payment-amount">Wallet Amount</span>
                <span className="payment-amount">Price</span>
                <span className="payment-amount">Wallet Remaining</span>
              </div>
            </div>
            {
              amount < 0 ? (
                <span>X_X</span>
              ) : (
                <div>
                  <button>Make Payment</button>
                </div>
              )
            }
          </div>
        )
      }
      return (
        <div className="col center x-center" style={{height: "100%"}}>
          <div className="row">
            <button onClick={() => { this.setState({ step: 1 })}}>Back</button>
          </div>
          <CCForm payableTo={Events.findOne().owner} amount={this.props.price} closeHandler={ this.props.closeHandler } cb={this.updatePaymentValues.bind(this)} />
        </div>
      )
    }
  }
}
