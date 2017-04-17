import React, { Component } from "react";
import Modal from "react-modal";

export default class TiebreakerModal extends Component {

  constructor(props) {
    super(props);
    const league = Leagues.findOne();
    const events = Events.find().fetch();
    const isOwner = Meteor.userId() == league.owner;
    this.state = {
      open: events.every(e => { return e.isComplete }) && !league.tiebreaker && isOwner
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
