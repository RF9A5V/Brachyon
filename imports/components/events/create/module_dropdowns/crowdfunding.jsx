import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class RevenuePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      item: 0
    }
  }

  value() {
    return {};
  }

  itemTabs() {
    var tabs = ["Rewards", "Tiers", "Prize Pool"];
    return (
      <div className="info-title-container">
        {
          tabs.map((tab, i) => {
            return (
              <div className={`info-title ${this.state.item == i ? "active" : ""}`} onClick={() => { this.setState({item: i}) }}>
                { tab }
              </div>
            )
          })
        }
      </div>
    )
  }

  itemDescriptions() {
    var tabs = ["Rewards", "Tiers", "Prize Pool"];
    var description = [
      (
        <div>
          <p>Allow us to reward you with a description of this section.
          Rewards act as incentives for your supporters to fund your event.
          One or more rewards can be applied to each tier. The same reward(s)
          can be applied to multiple tiers depending on how you wish to
          incentivize backers. We recommend rewards which pertain directly
          to the event.</p>

          <p>Check out our <a target="_blank" href="/faq">FAQ</a> to learn more about rewards.</p>
        </div>
      ),
      (
        <div>
          <p>Tiers are delicious! They are funding levels, grouping together
          one or more rewards. We recommend you apply rewards increasingly
          by value or amount.</p>

          <p>For some examples of successful tiers, click <a>here</a>.</p>
        </div>
      ),
      (
        <div>
          <p>By default 20% of all crowdfunding revenue goes to the Prize
          Pool. We recommend giving as much as possible to the Prize Pool -
          it attracts more players and increases hype!</p>

          <p>See some successful events in our <a target="_blank" href="/faq">FAQ</a> to learn about
          crowdfunding your Prize Pool.</p>
        </div>
      )
    ];
    return (
      <div className="col col-1 info-description">
        <h3 className="row center">{ tabs[this.state.item] }</h3>
        {
          description[this.state.item]
        }
      </div>
    )
  }

  render() {
    return (
      <div className="row panel">
        {
          this.itemTabs()
        }
        {
          this.itemDescriptions()
        }
      </div>
    )
  }
}
