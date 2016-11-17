import React, { Component } from "react";

export default class StartBracketAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  startEventHandler() {
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
      <div className="col center x-center col-1" style={{height: "calc(100% - 78px)"}}>
        <button onClick={this.startEventHandler.bind(this)}>Start Bracket</button>
      </div>
    )
  }
}
