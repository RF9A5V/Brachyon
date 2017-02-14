import React, { Component } from "react";

import BracketBar from "/imports/components/brackets/bar.jsx";

export default class BracketOverview extends Component {
  render() {
    var instance = Instances.findOne();
    return (
      <div className="row" style={{flexWrap: "wrap", alignItems: "flex-start", padding: 60, alignContent: "flex-start"}}>
        {
          instance.brackets.map((b, i) => {
            return (
              <BracketBar bracket={b} index={i} onBracketSelect={() => { this.props.onBracketSelect(i + 1) }} />
            )
          })
        }
      </div>
    )
  }
}
