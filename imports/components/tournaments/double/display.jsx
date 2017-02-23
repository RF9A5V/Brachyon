import React, { Component } from 'react'
import WinnersBracket from "./winners.jsx";
import LosersBracket from "./losers.jsx";

export default class DoubleDisplay extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="col">
        <WinnersBracket {...this.props} />
        <LosersBracket {...this.props} />
      </div>
    )

  }
}
