import React, { Component } from "react";

import CFTree from "./tree.jsx";

export default class CrowdfundingPanel extends Component {
  render() {
    var self = this;
    return (
      <div className="row">
        <div className="col col-2 x-center">
          <h3>Tiers</h3>
          {
            this.props.tiers == null ? (
              ""
            ) : (
              Object.keys(this.props.tiers).map(function(key){
                var tier = self.props.tiers[key];
                return (
                  <div className="col tier-block">
                    <div className="row x-center flex-pad" style={{marginBottom: 20}}>
                      <b style={{fontSize: 24}}>{ tier.name }</b>
                      <b style={{marginLeft: 20}}>${ (tier.price / 100).toFixed(2) }</b>
                    </div>
                    <span>{ tier.description }</span>
                    <div style={{textAlign: "right"}}>
                      <span style={{fontSize: 10}}>
                        Limit: <i>{ tier.limit }</i>
                      </span>
                    </div>
                  </div>
                )
              })
            )
          }
        </div>
        <div className="col-3 col x-center">
          <h3>Goals&nbsp;<sup>?</sup></h3>
          <CFTree goals={this.props.goals} />
        </div>
      </div>
    );
  }
}
