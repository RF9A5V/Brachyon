import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class CloseEventAction extends Component {

  onEventClose() {
    Meteor.call("events.close", Events.findOne()._id, err => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        browserHistory.push("/");
        return toastr.success("Successfully closed event!", "Success!");
      }
    })
  }

  render() {
    var brackets = Events.findOne().brackets;
    var hasBracketsOutstanding = brackets && brackets.length > 0 && brackets.some(bracket => { return !bracket.isComplete });
    return (
      <div className="col x-center">
        <h3>Close Your Event</h3>
        <div>
        <p>
          Closing your event will signal the completion of your event. People will no longer be able to find it through Brachyon's event discovery. Statistics associated with players for individual brackets in your event will be pushed to the players and you will be appreciated by Brachyon staff for being a responsible tournament organizer (which might mean more goodies in the future).
        </p>
        </div>
        {
          hasBracketsOutstanding ? (
            <span>You can't close this event while brackets are still running!</span>
          ) : (
            <button onClick={this.onEventClose.bind(this)}>Close Event</button>
          )
        }
      </div>
    )
  }
}
