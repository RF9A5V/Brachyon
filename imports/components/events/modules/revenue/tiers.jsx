import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TierPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      rewards: [],
      index: -1
    }
  }

  onTierCreate() {
    Meteor.call("events.crowdfunding.createTier", this.state.id, this.refs.name.value, this.refs.price.value * 100, this.refs.limit.value * 1, this.refs.description.value, this.state.rewards, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.name.value = "";
        this.refs.price.value = "";
        this.refs.limit.value = "";
        this.refs.description.value = "";
        this.setState({
          index: -1,
          rewards: []
        });
        return toastr.success("Successfully created reward tier.", "Success!");
      }
    })
  }

  onTierUpdate() {
    var rewards = this.refs[`rewards`];
    var indices = [];
    rewards.childNodes.forEach((icon, index) => {
      if(icon.classList.contains("active")) {
        indices.push(index);
      }
    });
    Meteor.call("events.crowdfunding.updateTier", this.state.id, this.state.index, this.refs[`name`].value, this.refs[`price`].value * 100, this.refs[`limit`].value * 1, this.refs[`description`].value, indices, (err) => {
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
        this.refs["name"].value = "";
        this.refs["price"].value = "";
        this.refs["limit"].value = "";
        this.refs["description"].value = "";
        this.setState({
          index: -1
        });
        return toastr.success("Successfully deleted tier!", "Success!");
      }
    })
  }

  toggleReward(index) {
    var rewardIndex = this.state.rewards.indexOf(index);
    if(rewardIndex < 0){
      this.state.rewards.push(index);
    }
    else {
      this.state.rewards.splice(rewardIndex, 1);
    }
    this.forceUpdate();
  }

  render() {
    var crowdfunding = Events.findOne().crowdfunding || {};
    var tiers = crowdfunding.tiers || [];
    var rewards = crowdfunding.rewards || [];
    var tier = this.state.index > -1 ? tiers[this.state.index] : {};
    return (
      <div>
        <div className="submodule-bg submodule-overflow" style={{marginTop: 10, padding: "0 10px 20px"}}>
          <div className="row center" style={{padding: "20px 0"}}>
            <h3>Tiers</h3>
          </div>
          <div className="row">
            <div className="col tier-preview-container" style={{width: "20%", minWidth: 200, backgroundColor: "#444", padding: 20, marginRight: 10}}>
              {
                tiers.map((tier, index) => {
                  return (
                    <div className="cf-tier col" onClick={() => {
                      var tier = tiers[index];
                      this.refs["name"].value = tier.name;
                      this.refs["price"].value = tier.price;
                      this.refs["limit"].value = tier.limit;
                      this.refs["description"].value = tier.description;
                      this.setState({ index: index, rewards: tier.rewards });
                    }} style={{backgroundColor: index == this.state.index ? "#FF6000" : "#333"}}>
                      { tier.name }
                    </div>
                  )
                })
              }
              <div className="cf-tier" onClick={() => {
                this.refs["name"].value = "";
                this.refs["price"].value = "";
                this.refs["limit"].value = "";
                this.refs["description"].value = "";
                this.setState({ index: -1, rewards: [] });
              }} style={{ textAlign: "center", backgroundColor: this.state.index == -1 ? "#FF6000" : "inherit" }}>
                <FontAwesome name="plus" style={{marginRight: 10}} />
                Add Tier
              </div>
            </div>
            <div className="col col-1" style={{backgroundColor: "#444", padding: 20, marginRight: 10}}>
              <h5>Name</h5>
              <input type="text" ref={"name"} defaultValue={tier.name} />
              <h5>Price</h5>
              <div className="row x-center">
                <input type="number" ref={"price"} defaultValue={((tier.price || 0) / 100).toFixed(2)} />
              </div>
              <h5>Limit</h5>
              <span>How many backers can buy this tier?</span>
              <div className="row x-center">
                <input type="number" ref={"limit"} defaultValue={tier.limit} />
              </div>
              <h5>Description</h5>
              <textarea ref={"description"} defaultValue={tier.description}></textarea>
            </div>
            <div className="col col-1 x-center" style={{backgroundColor: "#444", padding: 20}}>
              <h5>Rewards</h5>
              <span>Which rewards do you want on this tier?</span>
              <div className="row x-center center" ref={"rewards"}>
                {
                  rewards.map((reward, index) => {
                    return (
                      <div className={`selectable reward block ${ (this.state.rewards).indexOf(index) < 0 ? "" : "active" }`} onClick={() => { this.toggleReward(index) }}>
                        <img src={ reward.imgUrl } style={{width: 100, height: "auto"}} />
                        <div style={{fontSize: "0.7em"}}>
                          { reward.name }
                        </div>
                      </div>
                    )
                  })
                }
              </div>
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
