import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import MoneyInput from "/imports/components/public/money_input.jsx";

export default class TierRewardCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      create: false,
      tier: {}
    }
  }

  onTierCreate(e) {
    e.preventDefault();
    this.setState({
      open: true,
      create: true,
      tier: {}
    })
  }

  onTierEdit(index, tier) {
    return function(e) {
      e.preventDefault();
      this.setState({
        open: true,
        tier,
        index,
        create: false
      })
    }
  }

  onTierSubmit(e) {
    e.preventDefault();
    var tierObj = {
      amount: parseFloat(this.refs.amount.value()),
      description: this.refs.description.value,
      limit: parseInt(this.refs.limit.value)
    }
    if(this.state.create) {
      Meteor.call("events.createTier", Events.findOne()._id, tierObj, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully added tier!", "Success!");
          this.setState({
            open: false
          });
        }
      });
    }
    else {
      Meteor.call("events.editTier", Events.findOne()._id, this.state.index, tierObj, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully edited tier.", "Success!");
          this.setState({
            open: false
          });
        }
      })
    }

  }

  onTierDelete(e) {
    e.preventDefault();
    Meteor.call("events.deleteTier", Events.findOne(), this.state.index, (err) => {
      if(err){
        toastr.err(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted tier!", "Success!");
      }
      this.setState({
        open: false,
        tier: {}
      });
    });
  }

  render() {
    var tiers = typeof(this.props.tiers) == "boolean" ? [] : this.props.tiers;
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          tiers.map((tier, i) => {
            return (
              <div className="tier-block col" onClick={this.onTierEdit(i, tier).bind(this)}>
                <div className="row x-center flex-pad" style={{marginBottom: 15}}>
                  <h3>${(tier.amount / 100).toFixed(2)}</h3>
                  <span>Limit of {tier.limit}</span>
                </div>
                <span>{tier.description}</span>
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
            <MoneyInput ref="amount" defaultValue={(this.state.tier.amount / 100 || 0).toFixed(2)} />
            <label>Description</label>
            <textarea ref="description" defaultValue={this.state.tier.description}></textarea>
            <label>Limit</label>
            <input type="text" style={{margin: 0, marginBottom: 10}} ref="limit" defaultValue={this.state.tier.limit} />
            <div className="row center">
              {
                this.state.create ? (
                  ""
                ) : (
                  <button onClick={this.onTierDelete.bind(this)} style={{marginRight: 10}}>Delete</button>
                )
              }
              <button onClick={this.onTierSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
