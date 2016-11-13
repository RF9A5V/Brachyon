import React, { Component } from "react";
import { GameBanners } from "/imports/api/games/game_banner.js";

export default class GameResultTemplate extends Component {

  onClick(e) {
    e.preventDefault();
    this.props.onClick(this.props, this.props.name);
  }

  render() {
    return (
      <div className="game-result-template row x-center" onClick={this.onClick.bind(this)}>
        <img src={GameBanners.findOne(this.props.banner).link()} />
        <span style={{marginLeft: 10}}>
          { this.props.name }
        </span>
      </div>
    )
  }
}
