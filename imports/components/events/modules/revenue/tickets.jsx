import React, { Component } from "react";

export default class TicketPage extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    this.state = {
      id: event._id
    };
  }

  onTicketCostSave(id) {
    Meteor.call("events.revenue.updateTicketCost", this.state.id, id, this.refs["amount"+id].value * 1, this.refs["description"+id].value, (err) => {
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
    var brackets = event.brackets;
    var tickets = event.revenue.tickets || {};
    var venue = tickets.venue || {};
    var spec = tickets.spec || {};
    return (
      <div className="ticket-container">
        <div className="ticket-form col">
          <div className="row flex-pad">
            <span>Venue Fee</span>
            <div>
              <button onClick={() => { this.onTicketCostSave("venue") }}>Save</button>
            </div>
          </div>
          <span>Price</span>
          <input type="number" ref={"amountvenue"} defaultValue={venue.price}/>
          <span>Description</span>
          <textarea ref={"descriptionvenue"} defaultValue={venue.description}></textarea>
        </div>
        <div className="ticket-form col">
          <div className="row flex-pad">
            <span>Spectator Fee</span>
            <div>
              <button onClick={() => { this.onTicketCostSave("spectator") }}>Save</button>
            </div>
          </div>
          <span>Price</span>
          <input type="number" ref={"amountspectator"} defaultValue={spec.price}/>
          <span>Description</span>
          <textarea ref={"descriptionspectator"} defaultValue={spec.description}></textarea>
        </div>
        {
          brackets.map((bracket, i) => {
            var ticket = tickets["bracket"+i] || {};
            var id = "bracket"+i;
            return (
              <div className="ticket-form col">
                <div className="row flex-pad">
                  <span>Entry to { bracket.name }</span>
                  <div>
                    <button onClick={() => { this.onTicketCostSave(id) }}>Save</button>
                  </div>
                </div>
                <span>Price</span>
                <input type="number" ref={"amount" + id} defaultValue={ticket.amount}/>
                <span>Description</span>
                <textarea ref={"description" + id} defaultValue={ticket.description}></textarea>
              </div>
            )
          })
        }

      </div>
    )
  }
}
