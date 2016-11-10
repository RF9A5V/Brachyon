import React, { Component } from "react";

import Instances from "/imports/api/event/instance.js";
import Games from "/imports/api/games/games.js";

export default class TicketPage extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    this.state = {
      id: event._id
    };
  }

  onTicketCostSave(id) {
    Meteor.call("events.tickets.updateTicketCost", this.state.id, id, this.refs["amount"+id].value * 1, this.refs["description"+id].value, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Updated cost.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var brackets = instance.brackets || [];
    var tickets = instance.tickets;
    var venue = tickets.venue;
    var spec = tickets.spectator;
    return (
      <div className="submodule-bg submodule-overflow" style={{marginTop: 10, padding: 0, paddingTop: 10}}>
        <div className="ticket-container">
          <div className="ticket-form col">
            <div className="row" style={{justifyContent: "flex-end"}}>
              <button onClick={() => { this.onTicketCostSave("venue") }}>Save</button>
            </div>
            <div className="row center">
              <h5>Venue Fee</h5>
            </div>
            <h5>Price</h5>
            <input type="number" ref={"amountvenue"} defaultValue={(venue.price / 100).toFixed(2)}/>
            <h5>Description</h5>
            <textarea ref={"descriptionvenue"} defaultValue={venue.description}></textarea>
          </div>
          <div className="ticket-form col">
            <div className="row" style={{justifyContent: "flex-end"}}>
              <button onClick={() => { this.onTicketCostSave("spectator") }}>Save</button>
            </div>
            <div className="row center">
              <h5>Spectator Fee</h5>
            </div>
            <h5>Price</h5>
            <input type="number" ref={"amountspectator"} defaultValue={(spec.price / 100).toFixed(2)}/>
            <h5>Description</h5>
            <textarea ref={"descriptionspectator"} defaultValue={spec.description}></textarea>
          </div>
          {
            Object.keys(tickets).map((key) => {
              var i = parseInt(key);
              if(isNaN(i)){
                return "";
              }
              var ticket = tickets[key];
              var bracket = brackets[i];
              return (
                <div className="ticket-form col">
                  <div className="row" style={{justifyContent: "flex-end"}}>
                    <button onClick={() => { this.onTicketCostSave(i) }}>Save</button>
                  </div>
                  <div className="row center">
                    <h5>Entry to { Games.findOne(bracket.game).name } Bracket</h5>
                  </div>
                  <h5>Price</h5>
                  <input type="number" ref={"amount" + i} defaultValue={(ticket.price / 100).toFixed(2)}/>
                  <h5>Description</h5>
                  <textarea ref={"description" + i} defaultValue={ticket.description}></textarea>
                </div>
              )
            })
          }

        </div>
      </div>
    )
  }
}
