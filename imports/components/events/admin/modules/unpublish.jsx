import React, { Component } from "react";
import { browserHistory } from "react-router";

export default class Unpublish extends Component {

  onEventUnpublish() {
    Meteor.call("events.unpublish", Events.findOne()._id, (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        browserHistory.push("/");
        return toastr.success("Successfully unpublished event!", "Success!");
      }
    })
  }

  render() {
    return (
      <div>
        <p>
          Intuition is fucking important. Think about all the fucking possibilities. The graphic designer’s first fucking consideration is always the size and shape of the format, whether for the printed page or for digital display. Nothing of value comes to you without fucking working at it.
        </p>
        <p>
          The details are not the details. They make the fucking design. Design is all about fucking relationships—the relationship of form and content, the relationship of elements, the relationship of designer and user. Don’t get hung up on things that don’t fucking work. When you sit down to work, external critics aren’t the enemy. It’s you who you must to fight against to do great fucking work. You must overcome yourself. Nothing of value comes to you without fucking working at it. To go partway is easy, but mastering anything requires hard fucking work. You are not your fucking work.
        </p>
        <p>
          This design is fucking brilliant. Never, never assume that what you have achieved is fucking good enough. Must-do is a good fucking master. Form follows fucking function.
        </p>
        <div className="row center">
          <button onClick={ this.onEventUnpublish.bind(this) }>Unpublish</button>
        </div>
      </div>
    )
  }
}
