import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import SingleDisplay from './swiss/display.jsx';


//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {

  constructor(props)
  {
    super(props);
    this.state = {
      page: this.props.rounds.length-1;
    }
  }

  render() {

    return (
      <div className="row">
        <div className="col">
        {
            this.props.players.map((playerObj, i) => {
              return (
                <div>{player.name + " S: " + player.score + " W: " + player.wins + " L: " + player.losses}</div>
              )
            });
        }
        </div>
        <div className="row">
        {
          this.props.rounds[this.state.page].map((match, i) => {
            return(
              <div className="col center">
                <div>{match.playerOne}</div>
                <div>VS.</div>
                <div>{match.playerTwo}</div>
              </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}
