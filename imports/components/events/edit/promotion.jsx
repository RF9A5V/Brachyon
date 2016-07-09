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
      <div className="col">
        <button className="side-tab-button" onClick={this.onClick.bind(this)}>Save</button>
        <label> Enter a promotion bid </label>
        <input ref="bid" placeholder="Bid Amount" />
      </div>
    )
  }
}
