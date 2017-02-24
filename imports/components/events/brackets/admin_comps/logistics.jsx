import React, { Component } from "react";
import Modal from "react-modal";

import Instances from "/imports/api/event/instance.js";

export default class LogisticsPanel extends Component {

  





  render() {
    var instance = Instances.findOne();
    var bracket = instance.brackets[this.props.index];
    return (
      <div className="col center">

        {
          // bracket.isComplete ? (
          //   <h5>This bracket is already complete!</h5>
          // ) : (
          //   <div>
          //     <button onClick={this.closeBracketHandler.bind(this)}>Close</button>
          //   </div>
          // )
        }
      </div>
    )
  }
}
