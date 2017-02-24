import React, { Component } from "react";

export default class FinalizeBracket extends Component {

  closeBracketHandler() {
    var event = Events.findOne() || {};
    Meteor.call("events.brackets.close", event._id || Instances.findOne()._id, this.props.index || 0, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully closed bracket!", "Success!");
      }
    })
  }

  render() {
    return (
      <div>
        <h4 style={{marginTop: 0}}>
          Close the Bracket
        </h4>
        <div className="submodule-bg">
          <p>
            Closing the bracket will generate a leaderboard for the bracket and push statistics on performance to individual players. This action will also allow you to close your event successfully. This action cannot be taken while there are still matches to be played.
          </p>
          <div className="row center">
            <button className ="reset-highlight" onClick={this.closeBracketHandler.bind(this)} style={{width:"100px"}}>Finalize</button>
          </div>
        </div>
      </div>
    )
  }
}
