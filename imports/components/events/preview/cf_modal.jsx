import React, { Component } from "react";
import Modal from "react-modal";

export default class CFModal extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    var current = 0;
    for(var i in event.crowdfunding.sponsors) {
      if(event.crowdfunding.sponsors[i].id == Meteor.userId()) {
        current = event.crowdfunding.sponsors[i].cfAmount;
        break;
      }
    }
    var index = event.crowdfunding.tiers.length - 1;
    for(var i in event.crowdfunding.tiers) {
      if(event.crowdfunding.tiers[i].price > current) {
        index = i;
        break;
      }
    }
    this.state = {
      id: event._id,
      open: this.props.open,
      current,
      total: current,
      tiers: event.crowdfunding.tiers,
      index
    }
  }

  componentWillReceiveProps(next) {
    this.setState({
      open: next.open
    })
  }

  onSponsorAmountChange() {
    var value = parseInt(this.refs.amount.value);
    if(isNaN(value)) {
      value = 0;
    }
    var total = this.state.current + (value * 100);
    var index = this.state.tiers.length - 1;
    for(var i in this.state.tiers) {
      if(this.state.tiers[i].price > total) {
        index = i;
        break;
      }
    }
    this.setState({
      total,
      index
    })
  }

  barWidth() {
    return Math.min((this.state.total / this.state.tiers[this.state.index].price) * 100, 100) + "%"
  }

  onSponsorSubmit() {
    var value = parseInt(this.refs.amount.value);
    if(isNaN(value)){
      return toastr.error("Value needs to be non-zero and a number.", "Error!");
    }
    Meteor.call("events.crowdfunding.sponsor", this.state.id, value * 100, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      return toastr.success("Successfully sponsored $" + (value).toFixed(2) + "!", "Success!");
    })
  }

  render() {
    return (
      <div>
        <Modal isOpen={this.state.open} onRequestClose={this.props.close}>
          <div className="row">
            <div className="col col-3" style={{marginRight: 20}}>
              <div className="row center">
                <h3>Crowdfunding</h3>
              </div>
              <div className="row flex-pad" style={{marginBottom: 10}}>
                <h5>${(this.state.total / 100).toFixed(2)}</h5>
                <h5>${(this.state.tiers[this.state.index].price / 100).toFixed(2)}</h5>
              </div>
              <div className="progress-bar" style={{border: "solid 2px white", marginBottom: 20}}>
                <div style={{backgroundColor: "#6F6", width: this.barWidth(), height: 50}}>
                </div>
              </div>
              <div className="row" style={{marginBottom: 20}}>
                {
                  this.state.tiers.map((tier) => {
                    return (
                      <div style={{width: 20, height: 20, backgroundColor: this.state.total >= tier.price ? "#3F3" : "#F33", marginRight: 10}}>
                      </div>
                    )
                  })
                }
              </div>
              <div className="row x-center" style={{marginBottom: 20}}>
                <div className="col-1">
                  <h5>
                    Your Current
                  </h5>
                </div>
                <div className="col-1">
                  <h5>
                    ${(this.state.current / 100).toFixed(2)}
                  </h5>
                </div>
              </div>
              <div className="row x-center" style={{marginBottom: 20, paddingBottom: 20, borderBottom: "solid 2px white"}}>
                <div className="col-1">
                  <h5>
                    Input
                  </h5>
                </div>
                <div className="col-1">
                  <input type="number" placeholder="Amount" style={{margin: 0}} ref="amount" onChange={this.onSponsorAmountChange.bind(this)} />
                </div>
              </div>
              <div className="row x-center" style={{marginBottom: 20}}>
                <div className="col-1">
                  <h5>
                    Total
                  </h5>
                </div>
                <div className="col-1">
                  <h5>
                    ${(this.state.total / 100).toFixed(2)}
                  </h5>
                </div>
              </div>
              <div className="row center">
                <button onClick={this.onSponsorSubmit.bind(this)}>Sponsor</button>
              </div>
            </div>
            <div className="col col-2">
              <div className="row center">
                <h3>Rewards</h3>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
