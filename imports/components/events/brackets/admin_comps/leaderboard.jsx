import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";

export default class LeaderboardPanel extends Component {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var bracket = instance.brackets[props.index];
    var participants = [];
    if(bracket.format.baseFormat == "round_robin") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
      participants.sort(function(a, b) {
        return b.score - a.score;
      })
    }
    else if(bracket.format.baseFormat == "swiss") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
    }
    else {
      participants = instance.brackets[props.index].participants;
      participants.sort((a, b) => {
        return a.placement - b.placement;
      });
    }
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
                { player.alias || player.name }
              </li>
            )
          })
        }
        </ol>
      </div>
    )
  }
}
