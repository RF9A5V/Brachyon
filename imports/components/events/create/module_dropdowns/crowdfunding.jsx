import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class RevenuePanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: "Rewards"
    }
  }

  value() {
    return {};
  }

  onInfoClick(value) {
    return (e) => {
      if(e.target.classList.contains("active")) {
        return;
      }
      var desc = [
        {
          name: "Rewards",
          desc: (
            <div>
              <p>Allow us to reward you with a description of this section.
              Rewards act as incentives for your supporters to fund your event.
              One or more rewards can be applied to each tier. The same reward(s)
              can be applied to multiple tiers depending on how you wish to
              incentivize backers. We recommend rewards which pertain directly
              to the event.</p>

              <p>Check out our <a target="_blank" href="/faq">FAQ</a> to learn more about rewards.</p>
            </div>
          )
        },
        {
          name: "Tiers",
          desc: (
            <div>
              <p>Tiers are delicious! They are funding levels, grouping together
              one or more rewards. We recommend you apply rewards increasingly
              by value or amount.</p>

              <p>For some examples of successful tiers, click <a>here</a>.</p>
            </div>
          )
        },
        {
          name: "Prize Pool",
          desc: (
            <div>
              <p>By default 20% of all crowdfunding revenue goes to the Prize
              Pool. We recommend giving as much as possible to the Prize Pool -
              it attracts more players and increases hype!</p>

              <p>See some successful events in our <a target="_blank" href="/faq">FAQ</a> to learn about
              crowdfunding your Prize Pool.</p>
            </div>
          )
        }
      ];
      this.setState(desc[value]);
      document.querySelector(".info-title.active").classList.remove("active");
      e.target.classList.add("active");
    }
  }

  render() {
    return (
      <div className="row panel">
        <div className="info-title-container">
          <div className="info-title active" onClick={this.onInfoClick(0)}>
            Rewards
          </div>
          <div className="info-title" onClick={this.onInfoClick(1)}>
            Tiers
          </div>
          <div className="info-title" onClick={this.onInfoClick(2)}>
            Prize Pool
          </div>
        </div>
        <div className="col col-1 info-description">
          <h3 className="row center">{ this.state.name }</h3>
          {
            this.state.desc || (
              <div>
                <p>Allow us to reward you with a description of this section.
                Rewards act as incentives for your supporters to fund your event.
                One or more rewards can be applied to each tier. The same reward(s)
                can be applied to multiple tiers depending on how you wish to
                incentivize backers. We recommend rewards which pertain directly
                to the event.</p>

                <p>Check out our <a target="_blank" href="/faq">FAQ</a> to learn more about rewards.</p>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}
