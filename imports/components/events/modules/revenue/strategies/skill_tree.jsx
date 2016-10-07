import React, { Component } from "react";

import StretchGoalsOld from "../../../edit/stretch.jsx";

export default class SkillTree extends Component {

  onCreateSkillTreeStrat() {
    var id = Events.findOne()._id;
    Meteor.call("events.revenue.strategy.createSkillTree", id, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully set up strategy!", "Success!");
      }
    })
  }

  render() {
    var strat = (Events.findOne().revenue || {}).strategy || {};
    if(strat.name == "skill_tree"){
      return (
        <StretchGoalsOld goals={strat.goals} />
      )
    }
    else {
      return (
        <div>
          <button onClick={this.onCreateSkillTreeStrat.bind(this)}>Set Up Strategy</button>
        </div>
      )
    }
  }
}
