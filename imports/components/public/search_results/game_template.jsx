import React, { Component } from "react";

export default class GameResultTemplate extends Component {

  onClick(e) {
    e.preventDefault();
    this.props.onClick(this.props, this.props.name);
  }

  render() {
    return (
      <div className="game-result-template row x-center" onClick={this.onClick.bind(this)}>
        <img src={this.props.banner} />
        <span style={{marginLeft: 10}}>
          { this.props.name }
        </span>
      </div>
    )
  }
}
