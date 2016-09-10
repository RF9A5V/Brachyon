import React, { Component } from "react";

export default class TicketPage extends Component {

  constructor(props) {
    super(props);
    var event = Events.findOne();
    this.state = {
      id: event._id
    };
  }

  onTicketCostCreate() {
    Meteor.call("events.revenue.createTicketCost", this.state.id, this.refs.nameNew.value, this.refs.amountNew.value * 1, this.refs.descriptionNew.value, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        this.refs.nameNew.value = "";
        this.refs.amountNew.value = "";
        this.refs.descriptionNew.value = "";
        toastr.success("Created cost.", "Success!");
        this.forceUpdate();
      }
    })
  }

  onTicketCostSave(index) {
    Meteor.call("events.revenue.updateTicketCost", this.state.id, index, this.refs["name"+index].value, this.refs["amount"+index].value * 1, this.refs["description"+index].value, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Updated cost.", "Success!");
      }
    })
  }

  onTicketCostDelete(index) {
    Meteor.call("events.revenue.deleteTicketCost", this.state.id, index, (err) => {
      if(err){
        toastr.error(err.reason, "Error!");
      }
      else {
        var event = Events.findOne();
        var tickets = event.revenue.tickets;
        tickets.forEach((ticket, index) => {
          this.refs["name"+index].value = ticket.name;
          this.refs["amount"+index].value = ticket.amount;
          this.refs["description"+index].value = ticket.description;
        })
        toastr.success("Deleted ticket!", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    var tickets = event.revenue.tickets || [];
    return (
      <div className="col">
        <div className="ticket-container">
          {
            tickets.map((ticket, i) => {
              return (
                <div className="ticket-form col">
                  <div className="row flex-pad">
                    <span>Cost</span>
                    <div>
                      <button onClick={() => { this.onTicketCostDelete(i) }} style={{marginRight: 10}}>Delete</button>
                      <button onClick={() => { this.onTicketCostSave(i) }}>Save</button>
                    </div>
                  </div>
                  <span>Cost Name</span>
                  <input type="text" ref={"name" + i} defaultValue={ticket.name} />
                  <span>Cost Price</span>
                  <input type="number" ref={"amount" + i} defaultValue={ticket.amount}/>
                  <span>Cost Description</span>
                  <textarea ref={"description" + i} defaultValue={ticket.description}></textarea>
                </div>
              )
            })
          }
          <div className="ticket-form col">
            <div className="row flex-pad">
              <span>Cost</span>
              <button onClick={this.onTicketCostCreate.bind(this)}>Save</button>
            </div>
            <span>Cost Name</span>
            <input type="text" ref="nameNew" />
            <span>Cost Price</span>
            <input type="number" ref="amountNew" />
            <span>Cost Description</span>
            <textarea ref="descriptionNew"></textarea>
          </div>
        </div>
      </div>
    )
  }
}
