import React, { Component } from "react";
import Modal from "react-modal";

export default class LogisticsPanel extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  resetEventHandler() {
    var event = Events.findOne();
    Meteor.call("events.start_event", event._id, this.props.index, (err) => {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({ open: false });
        toastr.success("Successfully reset bracket!", "Success!");
      }
    });
  }

  closeBracketHandler() {
    var event = Events.findOne();
    Meteor.call("events.brackets.close", event._id, this.props.index, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully closed bracket!", "Success!");
      }
    })
  }

  render() {
    var bracket = Events.findOne().brackets[this.props.index];
    return (
      <div className="col">
        <h3>Restart the Bracket</h3>
        <p>
          Warning! This will regenerate your bracket from scratch, throwing everything back to round one. This is not recommended for large events or for events that have already played well into the bracket.
        </p>
        <div style={{marginBottom: 10}}>
          <button onClick={() => { this.setState({ open: true }) }}>Restart</button>
          <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
            <div className="col x-center center">
              <h3>DANGER</h3>
              <p>This action will be irreversible. You will not be able to roll back the bracket to a previous state except through manual input. Confirm this action.</p>
              <div>
                <button onClick={this.resetEventHandler.bind(this)} style={{marginRight: 10}}>Reset</button>
                <button onClick={() => { this.setState({open: false}) }}>Cancel</button>
              </div>
            </div>
          </Modal>
        </div>
        <h3>
          Close the Bracket
        </h3>
        <p>
          Closing the bracket will generate a leaderboard for the bracket and push statistics on performance to individual players. This action will also allow you to close your event successfully. This action cannot be taken while there are still matches to be played.
        </p>
        <div>
          <button onClick={this.closeBracketHandler.bind(this)}>Close</button>
        </div>
        {
          // bracket.isComplete ? (
          //   <h5>This bracket is already complete!</h5>
          // ) : (
          //   <div>
          //     <button onClick={this.closeBracketHandler.bind(this)}>Close</button>
          //   </div>
          // )
        }
      </div>
    )
  }
}
