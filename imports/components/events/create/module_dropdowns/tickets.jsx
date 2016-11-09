import React, { Component } from "react";

import Games from "/imports/api/games/games.js";

export default class TicketsPanel extends Component {

  value() {
    var obj = this.refs;
    Object.keys(this.refs).map((key) => {
      obj[key] = parseInt(this.refs[key].value * 100);
    })
    return obj;
  }

  onFocusLeave(e) {
    e.target.value = parseFloat(e.target.value).toFixed(2);
  }

  render() {
    var brackets = this.props.brackets();
    return (
      <div className="panel col">
        <span>Venue Fee</span>
        <input type="text" ref="venue" defaultValue={(0).toFixed(2)} onBlur={this.onFocusLeave.bind(this)} />
        <span>Spectator Fee</span>
        <input type="text" ref="spectator" defaultValue={(0).toFixed(2)} onBlur={this.onFocusLeave.bind(this)} />
        {
          brackets ? (
            brackets.map((bracket, i) => {
              console.log(bracket);
              if(!bracket.game) {
                return [];
              }
              return [
                (<span>Entry Fee to { Games.findOne(bracket.game).name } Bracket</span>),
                (<input type="text" ref={"bracketEntry" + i} defaultValue={(0).toFixed(2)} onBlur={this.onFocusLeave.bind(this)} />)
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
