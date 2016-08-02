import React, { Component } from "react";
import SingleDisplay from "/imports/components/tournaments/single/display.jsx";

export default class BracketPanel extends Component {

  startEvent(e) {
    e.preventDefault();
    Meteor.call("events.start_event", this.props.id, function(err){
      if(err){
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully started the event!", "Success!");
      }
    })
  }

  render() {
    if(this.props.active){
      return (
        <div>
          <SingleDisplay rounds={this.props.rounds} id={this.props.id} />
        </div>
      )
    }
    else {
      if(this.props.participants.length == 0){
        return (
          <h3>No participants currently in this event.</h3>
        )
      }
      return (
        <div className="col">
           {
             this.props.participants.map((participant) => {
               return (
                 <span>{Meteor.users.findOne(participant).username}</span>
               )
             })
           }
           <div>
            <button onClick={this.startEvent.bind(this)}>Start Event</button>
           </div>
        </div>
      )
    }
  }
}
