import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";
import Brackets from "/imports/api/brackets/brackets.js";

export default class AddPartipantAction extends Component {
  constructor(props) {
    super(props);
    var instance = Instances.findOne();
    var iid = instance._id;
    var bracket = instance.brackets[this.props.index];
    var started = instance.brackets[this.props.index].inProgress ? true:false;
    var participants = bracket.participants || [];
    this.state = {
      participants,
      iid,
      started,
      index: this.props.index
    }
  }

  render()
  {
    return(
      <div>
        <input type="number" placeholder="Win Score" ref="win_score" />
        <input type="number" placeholder="Lose Score" ref="lose_score" />
        <input type="number" placeholder="Tie Score" ref="tie_score" />
        <input type="number" placeholder="Bye Score" ref="bye_score" />
      </div>
    );
  }

}
