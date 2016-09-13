import React, { Component } from "react";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

export default class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  gameBanner(gameID){
    return Games.findOne(gameID).bannerUrl;
  }

  redirectToBracketPage(index) {
    console.log(index);
    browserHistory.push(`/events/${this.state.id}/brackets/${index}/admin`);
  }

  render() {
    var event = Events.findOne();
    var brackets = event.brackets || [];
    return (
      <div>
        {
          brackets.map((bracket, i) => {
            return (
              <div className="bracket-block" onClick={() => { this.redirectToBracketPage(i) }}>
                <img src={this.gameBanner(bracket.game)} />
                <div>
                  { bracket.name }
                </div>
              </div>
            )
          })
        }
        Bracket Stuff
      </div>
    )
  }
}
