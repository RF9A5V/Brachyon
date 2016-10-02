import React, { Component } from "react";

export default class TierCheckout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tierIndex: -1
    }
  }

  isValid() {
    return true;
  }

  value(cb) {
    cb({
      tierIndex: this.state.tierIndex
    });
  }

  onTierSelect(index) {
    this.setState({
      tierIndex: this.state.tierIndex == index ? -1 : index
    });
  }

  render() {
    var event = Events.findOne();
    var tiers = event.crowdfunding.tiers;
    var rewards = event.crowdfunding.rewards;
    return (
      <div className="col" style={{padding: 20}}>
        <div className="row center" style={{marginBottom: 20}}>
          <h3>Tiers</h3>
        </div>
        <div className="row">
          <div className="col-1"></div>
          <div className="submodule-section col-1">
            {
              event.crowdfunding.tiers.map((tier, i) => {
                return (
                  <div className={`sub-section-select ${this.state.tierIndex == i ? "active" : ""}`} onClick={() => { this.onTierSelect(i) }}>
                    ${
                      tier.price
                    }
                  </div>
                )
              })
            }
          </div>
          <div className="submodule-section col-2">
            {
              this.state.tierIndex >= 0 ? (
                <div className="col">
                  <div className="row center">
                    <h5>
                      ${
                        tiers[this.state.tierIndex].price
                      }
                    </h5>
                  </div>
                  <p>{ tiers[this.state.tierIndex].description }</p>
                  <h5>Rewards</h5>
                  <div className="row">
                    {
                      tiers[this.state.tierIndex].rewards.map((index) => {
                        var reward = rewards[index];
                        return (
                          <div className="block reward" onClick={() => {this.setRewardForEdit(reward, i)}}>
                            <img src={ reward.imgUrl } />
                            <div>
                              <span>{ reward.name }</span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              ) : (
                ""
              )
            }
          </div>
          <div className="col-1"></div>
        </div>
      </div>
    )
  }
}
