import React, { Component } from "react";

export default class StartBracketAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  startEventHandler(e) {
    e.preventDefault();
    var bracket = Events.findOne().brackets[this.props.index];
    Meteor.call("events.start_event", this.state.id, this.props.index, function(err) {
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully started bracket!", "Success!");
      }
    });
  }

  render() {
    return (
      <div className="col">
        <span>Start Bracket</span>
        <div>
          <button onClick={this.startEventHandler.bind(this)}>Start It</button>
        </div>
      </div>
    )
  }
}
