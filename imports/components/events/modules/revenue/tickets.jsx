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
    var brackets = event.brackets || [];
    var tickets = (event.tickets || {}).tickets || {};
    var venue = tickets.venue || {};
    var spec = tickets.spec || {};
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
            <input type="number" ref={"amountvenue"} defaultValue={venue.price}/>
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
            <input type="number" ref={"amountspectator"} defaultValue={spec.price}/>
            <h5>Description</h5>
            <textarea ref={"descriptionspectator"} defaultValue={spec.description}></textarea>
          </div>
          {
            brackets.map((bracket, i) => {
              var ticket = tickets["bracket"+i] || {};
              var id = "bracket"+i;
              return (
                <div className="ticket-form col">
                  <div className="row" style={{justifyContent: "flex-end"}}>
                    <button onClick={() => { this.onTicketCostSave(id) }}>Save</button>
                  </div>
                  <div className="row center">
                    <h5>Entry to { bracket.name }</h5>
                  </div>
                  <h5>Price</h5>
                  <input type="number" ref={"amount" + id} defaultValue={ticket.amount}/>
                  <h5>Description</h5>
                  <textarea ref={"description" + id} defaultValue={ticket.description}></textarea>
                </div>
              )
            })
          }

        </div>
      </div>
    )
  }
}
