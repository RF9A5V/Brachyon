import React, { Component } from "react";

import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";

export default class ApproveGameAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      games: Meteor.subscribe("unapprovedGames", {
        onReady: () => {
          this.setState({ ready: true })
        }
      }),
      ready: false,
      game: null
    }
  }

  approveGame(game) {
    Meteor.call("games.approve", game, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully approved game!", "Success!");
        this.setState({ game: null })
      }
    })
  }

  rejectGame(game) {
    Meteor.call("games.reject", game, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.warning("Rejected game.", "Warning!");
        this.setState({ game: null });
      }
    })
  }

  gameSelected() {
    var game = Games.findOne(this.state.game);
    return (
      <div className="col center x-center">
        <img src={Images.findOne(game.banner).link()} style={{width: 300, height: "auto"}} />
        <span>{ game.name }</span>
        <p>{ game.description }</p>
        <div className="row center x-center">
          <button onClick={() => { this.setState({ game: null }) }}>Back</button>
          <button onClick={() => { this.approveGame(game._id) }}>Approve</button>
          <button onClick={() => { this.rejectGame(game._id) }}>Reject</button>
        </div>
      </div>
    )
  }

  render() {
    if(!this.state.ready) {
      return (
        <div>
          Loading
        </div>
      )
    }
    if(this.state.game) {
      return this.gameSelected();
    }
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          Games.find({ approved: false }).map((game) => {
            return (
              <div className="game" onClick={() => { this.setState({ game: game._id }) }}>
                <img src={Images.findOne(game.banner).link()} />
                <div>
                  { game.name }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
