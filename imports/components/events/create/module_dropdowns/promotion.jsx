import React, { Component } from "react";

export default class PromotionPanel extends Component {

  values() {
    return {
      promotion: {
        mainPagePromo: this.refs.mainPagePromo.checked
      }
    }
  }

  render() {
    return (
      <div className="col">
        <div className="row x-center">
          <input type="checkbox" ref="mainPagePromo" />
          <span>
            Use [ATTR_VALUE]
          </span>
        </div>
      </div>
    )
  }
}
