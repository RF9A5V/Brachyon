import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class GameBlock extends Component {
  render() {
    const game = this.props.game;
    return (
      <div className="game col-1" onClick={this.props.onClick}>
        <img src={game.bannerUrl} />
        <div className="col game-description">
          <span ref={game.name} className="game-title">
            { game.name }
          </span>
          <div className="row center">
            <span className="game-count col-1">
              <FontAwesome name="users" style={{marginRight: 10}} />
              { game.playerCount || 0 }
            </span>
            <span className="game-count col-1">
              <FontAwesome name="clone" style={{marginRight: 10}} />
              { game.eventCount || 0 }
            </span>
          </div>
        </div>
      </div>
    )
  }
}
