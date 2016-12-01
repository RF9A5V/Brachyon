import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";
import TrackerReact from "meteor/ultimatejs:tracker-react";

export default class LeaderboardPanel extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var participants = [];
    bracket = Brackets.findOne();
    this.state = {
      ready: false,
      inst: instance
    }
  }

  componentWillUnmount(){
    if (this.state.bracket)
      this.state.bracket.stop();
  }  

  getParticipants()
  {
    bracket = Brackets.findOne();
    if(this.state.inst.brackets[this.props.index].format.baseFormat == "round_robin") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
      participants.sort(function(a, b) {
        return b.score - a.score;
      })
    }
    else if(this.state.inst.brackets[this.props.index].format.baseFormat == "swiss") {
      participants = bracket.rounds[bracket.rounds.length-1].players;
    }
    else {
      participants = this.state.inst.brackets[this.props.index].participants;
      participants.sort((a, b) => {
        return a.placement - b.placement;
      });
    }
    return participants;
  }

  render() {
    var br = Meteor.subscribe("brackets", this.props.id, {
      onReady: () => {
        this.setState({
          bracket: br,
          ready: true
        });
      }
    });


    if (this.state.ready)
    {
      var participants = this.getParticipants();
      return (
        <div>
          <ol>
          {
            participants.map((player, index) => {
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
    else
    {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}
