import React, { Component } from 'react';

export default class PromotionPanel extends Component {

  values() {
    return {
      bid: this.refs.bid.value * 1
    }
  }

  onClick(e) {
    this.props.updateSuite(this.values());
  }

  render() {
    return (
      <div>
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <div className="side-tab-panel row col-2">
          <h3>Front Page Access</h3>
          <input ref="bid" placeholder="Bid Amount" />
        </div>
      </div>
    )
  }
}
