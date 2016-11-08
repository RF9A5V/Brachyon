import React, { Component } from "react";

import Games from "/imports/api/games/games.js";

export default class TicketsPanel extends Component {

  onFocusLeave(e) {
    e.target.value = parseFloat(e.target.value).toFixed(2);
  }

  render() {
    var brackets = this.props.brackets();
    return (
      <div className="panel col">
        <span>Venue Fee</span>
        <input type="number" defaultValue={(0).toFixed(2)} step="0.1" onBlur={this.onFocusLeave.bind(this)} />
        <span>Spectator Fee</span>
        <input type="number" defaultValue={(0).toFixed(2)} step="0.1" onBlur={this.onFocusLeave.bind(this)} />
        {
          brackets ? (
            brackets.map((bracket) => {
              console.log(bracket);
              if(!bracket.game) {
                return [];
              }
              return [
                (<span>Entry Fee to { Games.findOne(bracket.game).name } Bracket</span>),
                (<input type="number" defaultValue={(0).toFixed(2)} step="0.1" onBlur={this.onFocusLeave.bind(this)} />)
              ]
            })
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
