import React, { Component } from "react";
import { Link } from "react-router";

import Games from "/imports/api/games/games.js";

export default class BracketPanel extends Component {
  render() {
    return (
      <div className="bracket-container">
        {
          this.props.brackets.map((bracket, i) => {
            return (
              <div className="bracket-block">
                <Link to={`/events/${Events.findOne()._id}/brackets/${i}`} style={{display: "inline-block"}}>
                  <img src={Images.findOne(Games.findOne(bracket.game).banner).url()} />
                  <span>
                    { bracket.name }
                  </span>
                </Link>
              </div>
            )
          })
        }
      </div>
    )
  }
}
