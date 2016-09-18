import React, { Component } from "react";
import Modal from "react-modal";

export default class TierBreakdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      tier: null,
      sponsor: null
    }
  }

  setShippingStatus() {
    Meteor.call("events.revenue.tiers.setShippedForSponsor", Events.findOne()._id, this.state.index, this.state.sponsor.id, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      return toastr.success("Successfully updated shipping status!", "Success!");
    })
  }

  render() {
    var tiers = Events.findOne().revenue.tiers;
    var rewards = Events.findOne().revenue.rewards;
    return (
      <div>
        {
          tiers.map((tier, index) => {
            return (
              <div className="col">
                <h3>{ tier.name }</h3>
                <div className="row">
                  {
                    (tier.sponsors || []).map((sponsor) => {
                      var user = Meteor.users.findOne(sponsor.id);
                      return (
                        <div className="col" style={{marginRight: 20, padding: 10, marginBottom: 20, backgroundColor: sponsor.shipped ? "#6D6" : "#666"}} onClick={() => { this.setState({
                          open: true,
                          tier,
                          sponsor,
                          index
                        }) }}>
                          <span style={{fontSize: "1.5em"}}>{ sponsor.name }</span>
                          <span style={{fontSize: "1.2em"}}>{ sponsor.address }</span>
                          <span style={{fontSize: "1.2em"}}>{ sponsor.city + " " + sponsor.state + ", " + sponsor.zip }</span>
                        </div>
                      )
                    })
                  }
                  {
                    (tier.sponsors || []).length > 0 ? (
                      ""
                    ) : (
                      <span>
                        No Sponsors for this Tier
                      </span>
                    )
                  }
                </div>
              </div>
            )
          })
        }
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
          {
            this.state.tier ? (
              <div className="col">
                <h3>
                  { this.state.tier.name }
                </h3>
                <span>
                  Need to deliver these rewards
                </span>
                <div className="row">
                  {
                    this.state.tier.rewards.map((r) => {
                      return (
                        <img src={rewards[r].imgUrl} style={{width: 100, height: 100, marginRight: 10, marginBottom: 10}} />
                      )
                    })
                  }
                </div>
                <span>
                  To this shipping address
                </span>
                <div className="col">
                  <span style={{fontSize: "1.5em"}}>{ this.state.sponsor.name }</span>
                  <span style={{fontSize: "1.2em"}}>{ this.state.sponsor.address }</span>
                  <span style={{fontSize: "1.2em"}}>{ this.state.sponsor.city + " " + this.state.sponsor.state + ", " + this.state.sponsor.zip }</span>
                </div>
                <button onClick={this.setShippingStatus.bind(this)}>
                  Shipped it!
                </button>
              </div>
            ) : (
              ""
            )
          }
        </Modal>
      </div>
    )
  }
}
