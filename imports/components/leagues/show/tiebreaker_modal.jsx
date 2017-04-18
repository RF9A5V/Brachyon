import React, { Component } from "react";
import Modal from "react-modal";

export default class TiebreakerModal extends Component {

  constructor(props) {
    super(props);
    const league = Leagues.findOne();
    const events = Events.find().fetch();
    const isOwner = Meteor.userId() == league.owner;
    var userToScore = {};
    league.leaderboard.forEach(l => {
      Object.keys(l).forEach(k => {
        userToScore[k] = userToScore[k] ? userToScore[k] + l[k] : l[k];
      })
    })
    var scoreToUser = {};
    Object.keys(userToScore).forEach(u => {
      if(scoreToUser[userToScore[u]]) {
        scoreToUser[userToScore[u]].push(u);
      }
      else {
        scoreToUser[userToScore[u]] = [u];
      }
    })
    const maxScore = Math.max.apply(null, Object.keys(scoreToUser));
    this.state = {
      open: events.every(e => { return e.isComplete }) && !league.tiebreaker && isOwner && (scoreToUser[maxScore] || []).length > 1
    }
  }

  generateTiebreaker() {
    const league = Leagues.findOne();
    Meteor.call("leagues.generateTiebreaker", league._id, (e) => {
      if(e) {
        toastr.error(e.reason);
      }
      else {
        toastr.success("Generated league tiebreaker!");
        this.setState({
          open: false
        });
        location.reload();
      }
    })
  }

  render() {
    return (
      <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
        <div className="col center x-center">
          Text for tiebreaker goes here!
          <button onClick={this.generateTiebreaker.bind(this)}>Generate Tiebreaker</button>
        </div>
      </Modal>
    )
  }
}
