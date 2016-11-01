import React, { Component } from "react";

import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";

export default class GamesIndexPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: Meteor.subscribe("games", {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false
    };
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
          Loading...
        </div>
      )
    }
    return (
      <div className="col">
        <div>

        </div>
        <div className="row" style={{padding: 20, flexWrap: "wrap"}}>
          {
            Games.find().map((game) => {
              return (
                <div className="image">
                  <img src={Images.findOne(game.banner).link()} />
                  <span>{ game.name }</span>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}
