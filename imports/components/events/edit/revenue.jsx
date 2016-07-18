import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

import CrowdfundingTree from "../crowdfunding/crowdfunding_tree.jsx";

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

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

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
      <div style={{position: "relative"}}>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="row">
          <div className="side-tab-panel col-1">
            <h3>Crowdfunding Tiers</h3>
            <i>Don"t forget to save by hitting the Save button up top!</i>
            <TierPanel ref="tiers" type={"Tier"} stubs={this.props.tiers} />
          </div>
          <div className="side-tab-panel col-1">
            <h3>Ticketing</h3>
            <i>Don"t forget to save by hitting the Save button up top!</i>
            <TierPanel ref="tickets" type={"Ticket"} stubs={this.props.tickets} />
          </div>
        </div>
        <div className="side-tab-panel row col-2">
          <h3>Stretch Goals</h3>
          <CrowdfundingTree edit={true} goals={this.props.goals} ref="goals" />
        </div>
        <Modal className="create-modal" overlayClassName="overlay-class" isOpen={this.state.open}>
          <div className="row justify-end">
            <FontAwesome onClick={() => { this.setState({open: false}) }} name="times" size="2x" className="close-modal"/>
          </div>
          <div>
            <b>So what the hell is this?</b>
            <div style={{marginTop: 20}}>
              Don’t fucking lie to yourself. Someday is not a fucking day of the week. To go partway is easy, but mastering anything requires hard fucking work. Never, never assume that what you have achieved is fucking good enough. Use your fucking hands. This design is fucking brilliant. You won’t get good at anything by doing it a lot fucking aimlessly.
            </div>
            <div style={{marginTop: 20}}>
              Nothing of value comes to you without fucking working at it. Remember it’s called the creative process, it’s not the creative fucking moment. Don’t fucking lie to yourself. You need to sit down and sketch more fucking ideas because stalking your ex on facebook isn’t going to get you anywhere.
            </div>
            <div style={{marginTop: 20}}>
              Practice won’t get you anywhere if you mindlessly fucking practice the same thing. Change only occurs when you work deliberately with purpose toward a goal. This design is fucking brilliant. You won’t get good at anything by doing it a lot fucking aimlessly. Don’t worry about what other people fucking think. When you design, you have to draw on your own fucking life experiences. If it’s not something you would want to read/look at/use then why fucking bother? Must-do is a good fucking master. This design is fucking brilliant. The details are not the details. They make the fucking design.
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
