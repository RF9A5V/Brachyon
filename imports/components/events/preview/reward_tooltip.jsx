import React, { Component } from "react";

import Rewards from "/imports/api/sponsorship/rewards.js";
import { RewardIcons } from "/imports/api/sponsorship/reward_icon.js";

export default class RewardTooltip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      x: 0,
      y: 0,
      reward: Rewards.findOne(props.reward)
    };
  }

  componentWillMount() {
    window.onmousemove = (e) => {
      this.setState({
        x: e.clientX,
        y: e.clientY
      })
    }
  }

  render() {
    var reward = this.state.reward;
    console.log(reward);
    return (
      <div className="reward-tooltip" style={{top: this.state.y, left: this.state.x + 20}}>
        <div className="row x-center" style={{marginBottom: 20}}>
          <img src={RewardIcons.findOne(reward.img).link()} />
          <h5>{ reward.name }</h5>
        </div>
        <div className="reward-description" dangerouslySetInnerHTML={{__html: reward.description}}>
        </div>
      </div>
    )
  }
}
