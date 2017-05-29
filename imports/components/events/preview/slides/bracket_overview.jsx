import React, { Component } from "react";

import BracketBar from "/imports/components/brackets/bar.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class BracketOverview extends ResponsiveComponent {
  renderBase(opts) {
    var instance = Instances.findOne();
    return (
      <div className="row" style={{flexWrap: "wrap", alignItems: "flex-start", padding: opts.padding, alignContent: "flex-start"}}>
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

  renderDesktop() {
    return this.renderBase({
      padding: 60
    })
  }

  renderMobile() {
    return this.renderBase({
      padding: 10
    })
  }
}
