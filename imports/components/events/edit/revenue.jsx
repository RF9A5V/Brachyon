import React, { Component } from 'react';

import CrowdfundingTree from '../crowdfunding/crowdfunding_tree.jsx';

class TierPanel extends Component {

  constructor(props) {
    super(props);
    var obj = {};
    this.state = {
      active: false,
      stubs: props.stubs || {},
      index: 0
    }
  }

  setForm(val, index) {
    return function(e){
      e.preventDefault();
      this.setState({
        active: true,
        index
      })
      if(this.refs.name){
        this.refs.name.value = val.name;
        this.refs.description.value = val.description;
        this.refs.price.value = (val.price / 100).toFixed(2);
        this.refs.limit.value = val.limit;
      }
    }
  }

  addTier(e) {
    e.preventDefault();
    var len = Object.keys(this.state.stubs).length
    this.state.stubs[len] = {
      name: "Name This " + this.props.type,
      description: "Add a description!",
      price: 100,
      limit: 100
    };

    this.state.index = len;
    this.state.active = true;

    var val = this.state.stubs[len];

    this.refs.name.value = val.name;
    this.refs.description.value = val.description;
    this.refs.price.value = (val.price / 100).toFixed(2);
    this.refs.limit.value = val.limit;

    this.forceUpdate();
  }

  removeTier(e) {
    e.preventDefault();
    delete this.state.stubs[this.state.index];
    this.state.index = 0;
    this.state.active = false;
    this.forceUpdate();
  }

  onChange(e) {
    if(this.refs.name.value == ""){
      this.refs.name.value = "No Value";
    }
    this.state.stubs[this.state.index] = {
      name: this.refs.name.value,
      description: this.refs.description.value,
      price: this.refs.price.value * 100,
      limit: this.refs.limit.value
    };
  }

  values() {
    return this.state.stubs;
  }

  render() {
    var self = this;
    var temp = {margin: 0, marginBottom: 10};
    return (
      <div className="tier-stub-container">
        <div className="col" style={{display: this.state.active ? "flex" : "none"}}>
          <i>Your changes are saved as you type!</i>
          <label>{ this.props.type } Name</label>
          <input type="text" ref="name" style={temp} onChange={this.onChange.bind(this)} />
          <label>Description</label>
          <textarea ref="description" onChange={this.onChange.bind(this)} ></textarea>
          <label>Amount</label>
          <input type="text" ref="price" style={temp} onChange={this.onChange.bind(this)} />
          <label>Limit</label>
          <input type="text" ref="limit" style={temp} onChange={this.onChange.bind(this)} />
          <div>
            <button onClick={this.removeTier.bind(this)}>Delete {this.props.type}</button>
          </div>
        </div>
        {
          Object.keys(this.state.stubs).map(function(val, index) {
            return (
              <div className="tier-stub" onClick={self.setForm(self.state.stubs[val], index).bind(self)}>
                { self.state.stubs[val].name } - ${ (self.state.stubs[val].price * 1 / 100).toFixed(2) }
              </div>
            )
          })
        }
        <div className="tier-stub" onClick={this.addTier.bind(this)}>
          Add A { this.props.type }
        </div>
      </div>
    )
  }
}

export default class RevenuePanel extends Component {

  onClick(e) {
    this.props.updateSuite(this.values());
  }

  values(){
    return {
      tiers: this.refs.tiers.values(),
      tickets: this.refs.tickets.values(),
      goals: this.refs.goals.values()
    }
  }

  render() {
    return (
      <div className="col" style={{position: "relative"}}>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="row" style={{alignItems: "flex-start"}}>
          <div className="side-tab-panel">
            <label>Crowdfunding Tiers</label>
            <i>Don't forget to save by hitting the Save button up top!</i>
            <TierPanel ref="tiers" type={"Tier"} stubs={this.props.tiers} />
          </div>
          <div className="side-tab-panel">
            <label>Ticketing</label>
            <i>Don't forget to save by hitting the Save button up top!</i>
            <TierPanel ref="tickets" type={"Ticket"} stubs={this.props.tickets} />
          </div>
          <div className="side-tab-panel">
            <label>Stretch Goals</label>
            <CrowdfundingTree edit={true} goals={this.props.goals} ref="goals" />
          </div>
          <div style={{minWidth: "calc(85vw - 480px)", height: 1}}>
          </div>
        </div>
      </div>
    );
  }
}
