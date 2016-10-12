import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

//Called by: imports\components\events\show\bracket.jsx
export default class SwissDisplay extends TrackerReact(Component) {

  constructor(props)
  {
    super(props);
    this.state = {
      page: this.props.rounds.length-1,
      winc: 0
    }
  }

  declareWinner(pos, score)
  {
      Meteor.call("events.update_match", this.props.id, 0, this.props.page, score, pos, function(err) {
        if(err){
          console.log(err);
          toastr.error("Couldn't advance this match.", "Error!");
        }
        else {
          toastr.success("Player advanced to next round!", "Success!");
        }
      });
  }

  render() {

    return (
      <div className="row">
        <div className="col">
        {
            this.props.rounds[this.state.page].players.map((playerObj, i) => {
              return (
                <div>{playerObj.name + " S: " + playerObj.score + " W: " + playerObj.wins + " L: " + playerObj.losses}</div>
              );
            })
        }
        </div>
        <div className="row">
        {
          this.props.rounds[this.state.page].matches.map((match, i) => {
            return(
              <div className="col center" style={{paddingLeft: "20px"}}>
                <div>{match.playerOne}</div>
                <div>VS.</div>
                <div>{match.playerTwo}</div>
              </div>
            );
          })
        }
        </div>
      </div>
    )
  }
}
