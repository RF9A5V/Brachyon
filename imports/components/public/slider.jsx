import React, { Component } from "react";

// props.tiers: []

export default class PaymentSlider extends Component {

  constructor(props) {
    super(props);
    var max = props.tiers[Object.keys(props.tiers).length - 1].price * 1;
    var found = false;
    var size = Object.keys(props.tiers).length;
    var key = null;
    for(var i = size - 1; i >= 0; i--){
      if(props.tiers[i].price * 1 <= props.contrib){
        key = i;
        found = true;
        break;
      }
    }
    this.state = {
      sliderPosition: `${Math.min(props.contrib / max * 100, 100)}%`,
      key,
      amount: 0
    }
  }

  componentWillReceiveProps(next) {
    var max = this.props.tiers[Object.keys(this.props.tiers).length - 1].price * 1;
    this.setState({
      sliderPosition: `${Math.min(next.contrib / max * 100, 100)}%`
    })
  }

  tierSelect(key, left, amount) {
    return function(e) {
      this.refs.amount.value = amount;
      this.setState({
        sliderPosition: left + "%",
        key,
        amount
      });
    }
  }

  tiers() {
    var self = this;
    var keys = Object.keys(this.props.tiers);
    var max = this.props.tiers[keys[keys.length - 1]].price * 1;
    return keys.map((key) => {
      var left = self.props.tiers[key].price * 1 / max * 100;
      return (
        <div className="col slider-tier" style={{left: `${left}%`}} onClick={self.tierSelect(key, left, self.props.tiers[key].price * 1).bind(this)}>
          <div style={{width: 5, height: 20, backgroundColor: "white"}}></div>
          <span>
            { self.props.tiers[key].price }
          </span>
        </div>
      )
    })
  }

  sponsorEvent(e) {
    e.preventDefault();
    var self = this;
    Meteor.call("events.sponsor", this.props.id, this.state.amount, function(err){
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Bueno!", "Success!");
        self.refs.amount.value = 0;
        self.setState({
          amount: 0
        })
      }
    });
  }

  moveSlider(e) {
    var amount = e.target.value * 1;
    if(isNaN(amount)){
      this.setState({
        amount: 0
      })
      return false;
    }
    var total = amount + this.props.contrib;
    var found = false;
    var size = Object.keys(this.props.tiers).length;
    var key = null;
    for(var i = size - 1; i >= 0; i--){
      if(this.props.tiers[i].price * 1 <= total){
        key = i;
        found = true;
        break;
      }
    }
    var max = this.props.tiers[Object.keys(this.props.tiers).length - 1].price * 1;
    this.setState({
      sliderPosition: `${Math.min(total / max * 100, 100)}%`,
      amount,
      key
    })
  }

  render() {
    return (
      <div style={{position: "relative", padding: "0 40px 0 20px"}}>
        <div className="col slider-control" ref="sliderControl" style={{left: this.state.sliderPosition}}>
          <div className="slider-control-header">
            { (this.props.contrib * 1) + this.state.amount }
          </div>
          <div className="triangle-bottom"></div>
        </div>
        <div className="slider-bar" ref="sliderBar">
          { this.tiers() }
        </div>
        <div className="col" style={{marginTop: 60}}>
          <label>Amount</label>
          <div style={{position: "relative"}}>
            <div style={{position: "absolute", top: 7, left: 7, width: 25, height: 25, borderRadius: "100%", backgroundColor: "gold"}}>
            </div>
            <input style={{paddingLeft: 39, margin: 0, marginBottom: 10}} type="text" ref="amount" onChange={this.moveSlider.bind(this)}/>
          </div>
          <button onClick={this.sponsorEvent.bind(this)}>
            Sponsor!
          </button>
        </div>
        {
          this.state.key !== null && this.props.tiers[this.state.key] ? (
            <div className="col">
              <div className="row x-center">
                <h3 className="col-1">{ this.props.tiers[this.state.key].name }</h3>
                <div>{this.props.tiers[this.state.key].limit - (this.props.tiers[this.state.key].count || 0)} left of {this.props.tiers[this.state.key].limit}</div>
              </div>
              <span>{ this.props.tiers[this.state.key].description }</span>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
