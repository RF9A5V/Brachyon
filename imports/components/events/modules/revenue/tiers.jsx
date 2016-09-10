import React, { Component } from "react";

export default class TierPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onTierCreate() {
    Meteor.call("events.revenue.createTier", this.state.id, this.refs.name.value, this.refs.price.value * 1, this.refs.limit.value * 1, this.refs.description.value, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.name.value = "";
        this.refs.price.value = "";
        this.refs.limit.value = "";
        this.refs.description.value = "";
        return toastr.success("Successfully created reward tier.", "Success!");
      }
    })
  }

  onTierUpdate(index) {
    Meteor.call("events.revenue.updateTier", this.state.id, index, this.refs[`name${index}`].value, this.refs[`price${index}`].value * 1, this.refs[`limit${index}`].value * 1, this.refs[`description${index}`].value, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully updated tier!", "Success!");
      }
    })
  }

  onTierDelete(index) {
    Meteor.call("events.revenue.deleteTier", this.state.id, index, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        var event = Events.findOne();
        var tiers = event.revenue.tiers;
        tiers.forEach((tier, i) => {
          var keyList = Object.keys(tier);
          for(var j in keyList){
            this.refs[keyList[j] + i].value = tier[keyList[j]];
          }
        })
        return toastr.success("Successfully deleted tier!", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    var tiers = event.revenue.tiers || [];
    return (
      <div className="col">
        {
          tiers.map((tier, i) => {
            return (
              <div className="ticket-form col">
                <div className="row flex-pad">
                  <div></div>
                  <div>
                    <button onClick={ () => { this.onTierDelete(i) } } style={{marginRight: 10}}>Delete</button>
                    <button onClick={() => { this.onTierUpdate(i) }}>Save</button>
                  </div>
                </div>
                <span>Tier Name</span>
                <input type="text" ref={"name"+i} defaultValue={tier.name} />
                <span>Tier Price</span>
                <input type="number" ref={"price"+i} defaultValue={tier.price} />
                <span>Tier Amount</span>
                <input type="number" ref={"limit"+i} defaultValue={tier.limit} />
                <span>Tier Description</span>
                <textarea ref={"description"+i} defaultValue={tier.description}></textarea>
              </div>
            )
          })
        }
        <div className="ticket-form col">
          <div className="row flex-pad">
            <div></div>
            <button onClick={this.onTierCreate.bind(this)}>Save</button>
          </div>
          <span>Tier Name</span>
          <input type="text" ref="name" />
          <span>Tier Price</span>
          <input type="number" ref="price" />
          <span>Tier Amount</span>
          <input type="number" ref="limit" />
          <span>Tier Description</span>
          <textarea ref="description"></textarea>
        </div>
      </div>
    )
  }
}
