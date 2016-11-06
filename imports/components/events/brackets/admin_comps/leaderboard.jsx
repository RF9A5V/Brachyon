import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";

export default class LeaderboardPanel extends Component {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var participants = instance.brackets[props.index].participants;
    participants.sort((a, b) => {
      return a.placement - b.placement;
    });
    this.state = {
      participants
    }
  }

  render() {
    return (
      <div>
        <ol>
        {
          this.state.participants.map((player, index) => {
            return (
              <li style={{marginBottom: 10, padding: 20, backgroundColor: "#222"}}>
                { player.alias }
              </li>
            )
          })
        }
        </ol>
      </div>
    )
  }
}
