import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

import Loading from "/imports/components/public/loading.jsx";
import Editor from "/imports/components/public/editor.jsx";

import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

export default class TierPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      rewards: [],
      tickets: [],
      index: -1,
      ready: false,
      tier: {},
      loadTier: false
    }
  }

  onTierCreate() {
    Meteor.call("events.crowdfunding.createTier", this.state.id, this.refs.name.value, this.refs.price.value * 100, this.refs.limit.value * 1, this.state.description, this.state.rewards, this.state.tickets, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.name.value = "";
        this.refs.price.value = "";
        this.refs.limit.value = "";
        this.refs.description.reset();
        this.setState({
          index: -1,
          rewards: [],
          tickets: []
        });
        return toastr.success("Successfully created reward tier.", "Success!");
      }
    })
  }

  onTierUpdate() {
    Meteor.call("events.crowdfunding.updateTier", this.state.id, this.state.index, this.refs[`name`].value, this.refs[`price`].value * 100, this.refs[`limit`].value * 1, this.state.description, this.state.rewards, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully updated tier!", "Success!");
      }
    })
  }

  onTierDelete() {
    Meteor.call("events.crowdfunding.deleteTier", this.state.id, this.state.index, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setTier({}, -1);
        return toastr.success("Successfully deleted tier!", "Success!");
      }
    })
  }

  toggleReward(id) {
    var rewardIndex = this.state.rewards.indexOf(id);
    if(rewardIndex < 0){
      this.state.rewards.push(id);
    }
    else {
      this.state.rewards.splice(rewardIndex, 1);
    }
    this.forceUpdate();
  }

  ticketView() {
    var instance = Instances.findOne();
    if(instance.tickets) {
      var ticketRender = Object.keys(instance.tickets).map((ticket) => {
        var content = "";
        if(isNaN(ticket)) {
          content = ticket[0].toUpperCase() + ticket.slice(1);
        }
        else {
          var game = Games.findOne(instance.brackets[parseInt(ticket)].game);
          content = `Entry to ${game.name}`;
        }
        var hasTicket = this.state.tickets.indexOf(ticket) >= 0;
        return (
          <div className={`ticket-selectable ${hasTicket ? "active" : ""}`} onClick={() => {
            if(hasTicket) {
              this.state.tickets.splice(this.state.tickets.indexOf(ticket), 1);
            }
            else {
              this.state.tickets.push(ticket);
            }
            this.forceUpdate();
          }}>
            { content }
          </div>
        )
      })
      return [
        <h5 style={{marginTop: 20}}>Tickets</h5>,
        <span>Which tickets do you want on this tier?</span>,
        ticketRender
      ]
    }
    return [];
  }

  setTier(tier, index) {
    this.setState({
      tier,
      loadTier: true,
      description: tier.description,
      index,
      rewards: tier.rewards || [],
      tickets: tier.tickets || []
    });
    setTimeout(() => {
      this.setState({
        loadTier: false
      });
    }, 10)
  }

  render() {
    if(!this.state.ready) {
      var rewards = Meteor.subscribe("rewards", Events.findOne().slug, {
        onReady: () => {
          this.setState({
            rewardSub: rewards,
            ready: true
          })
        }
      });
      return <Loading />
    }
    var crowdfunding = Events.findOne().crowdfunding || {};
    var tiers = crowdfunding.tiers || [];
    var rewards = Rewards.find();
    var tier = this.state.index > -1 ? tiers[this.state.index] : {};
    return (
      <div>
        <h4>Tiers</h4>
        <div className="submodule-bg submodule-overflow" style={{padding: "0 10px 20px"}}>
          <div className="row">
            <div className="col tier-preview-container" style={{width: "20%", minWidth: 200, backgroundColor: "#444", padding: 20, marginRight: 10}}>
              {
                tiers.map((tier, index) => {
                  return (
                    <div className="cf-tier col" onClick={() => {
                      this.setTier(tier, index);
                    }} style={{backgroundColor: index == this.state.index ? "#FF6000" : "#333"}}>
                      { tier.name }
                    </div>
                  )
                })
              }
              <div className="cf-tier" onClick={() => {
                this.setTier({}, -1);
              }} style={{ backgroundColor: this.state.index == -1 ? "#FF6000" : "inherit" }}>
                <FontAwesome name="plus" style={{marginRight: 10}} />
                Add Tier
              </div>
            </div>
            {
              this.state.loadTier ? (
                <div className="col col-1 center x-center">
                  <Loading />
                </div>
              ) : (
                <div className="col col-1" style={{backgroundColor: "#444", padding: 20, marginRight: 10}}>
                  <h5>Name</h5>
                  <input type="text" ref={"name"} defaultValue={this.state.tier.name} />
                  <div className="row">
                    <div className="col col-1" style={{marginRight: 20}}>
                      <h5 className="col-1">Price</h5>
                      <input style={{marginRight: 0}} type="number" ref={"price"} defaultValue={((this.state.tier.price || 0) / 100).toFixed(2)} />
                    </div>
                    <div className="col col-1">
                      <h5>Limit</h5>
                      <span>How many backers can buy this tier?</span>
                      <input style={{marginRight: 0}} type="number" ref={"limit"} defaultValue={this.state.tier.limit} />
                    </div>
                  </div>
                  <h5 style={{marginBottom: 10}}>Description</h5>
                  <Editor ref="description" usePara={true} onChange={(value) => { this.setState({ description: value }) }} value={this.state.tier.description} />
                </div>
              )
            }
            <div className="col col-1 x-center" style={{backgroundColor: "#444", padding: 20}}>
              <h5>Rewards</h5>
              {
                rewards.map((reward, index) => {
                  return (
                    <div className={`reward-selectable row x-center ${this.state.rewards.indexOf(reward._id) < 0 ? "" : "active"}`} onClick={() => { this.toggleReward(reward._id) }}>
                      <img src={ reward.imgUrl } />
                      <div className="col">
                        <span>{ reward.name }</span>
                        <sub>Value of ${(reward.value / 100).toFixed(2)}</sub>
                      </div>
                    </div>
                  )
                })
              }
              {
                this.ticketView()
              }
            </div>
          </div>
          <div className="row center" style={{marginTop: 20}}>
            {
              this.state.index > -1 ? (
                <div className="row center">
                  <button style={{marginRight: 10}} onClick={this.onTierUpdate.bind(this)}>Save</button>
                  <button onClick={this.onTierDelete.bind(this)}>Delete</button>
                </div>

              ) : (
                <div className="row center">
                  <button onClick={this.onTierCreate.bind(this)}>Create</button>
                </div>
              )
            }
          </div>
        </div>
      </div>
    )
  }
}
