import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import MoneyInput from "/imports/components/public/money_input.jsx";

export default class TicketCollection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ticket: {},
      open: false,
      create: false,
      id: Events.findOne()._id
    }
  }

  onTicketCreate(e) {
    e.preventDefault();
    this.setState({
      open: true,
      ticket: {},
      create: true
    })
  }

  onTicketEdit(ticket, index) {
    return (e) => {
      e.preventDefault();
      this.setState({
        open: true,
        ticket,
        index,
        create: false
      })
    }
  }

  onTicketDelete(e) {
    e.preventDefault();
    Meteor.call("events.deleteTicket", this.state.id, this.state.index, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        toastr.success("Successfully deleted ticket!", "Success!");
      }
    })
  }

  onTicketSubmit(e) {
    e.preventDefault();
    var refs = this.refs;
    var ticketObj = {
      name: refs.name.value,
      amount: refs.amount.value(),
      description: refs.description.value,
      limit: refs.limit.value
    }
    if(this.state.create) {
      Meteor.call("events.createTicket", this.state.id, ticketObj, (err) => {
        if(err){
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully created ticket.", "Success!");
          this.setState({
            open: false
          });
        }
      });
    }
    else {
      Meteor.call("events.editTicket", this.state.id, this.state.index, ticketObj, (err) => {
        if(err) {
          toastr.error(err.reason, "Error!");
        }
        else {
          toastr.success("Successfully edited ticket.", "Success!");
          this.setState({
            open: false
          });
        }
      });
    }
  }

  render() {
    var tickets = typeof(this.props.tickets) == "boolean" ? [] : this.props.tickets;
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          tickets.map((ticket, i) => {
            return (
              <div className="ticket-block col" onClick={ this.onTicketEdit(ticket, i).bind(this) } key={i}>
                <h3>{ ticket.name }</h3>
                <div className="row flex-pad x-center">
                  <span>{ (ticket.amount / 100).toFixed(2) }</span>
                  <span>{ ticket.limit } Available</span>
                </div>
                <span>
                  { ticket.description }
                </span>
              </div>
            )
          })
        }
        <div className="ticket-block col x-center" onClick={this.onTicketCreate.bind(this)}>
          <div className="row center x-center" style={{padding: 20}}>
            <FontAwesome name="plus" size="2x" />
          </div>
          <span>Add a Ticket</span>
        </div>
        <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({open: false}) }}>
          <div className="col">
            <label>Name</label>
            <input type="text" ref="name" defaultValue={this.state.ticket.name} />
            <label>Amount</label>
            <MoneyInput ref="amount" defaultValue={(this.state.ticket.amount / 100 || 0).toFixed(2)} />
            <label>Description</label>
            <textarea ref="description" defaultValue={this.state.ticket.description}></textarea>
            <label>Limit</label>
            <input type="text" style={{margin: 0, marginBottom: 10}} ref="limit" defaultValue={this.state.ticket.limit} />
            <div className="row center">
              {
                this.state.create ? (
                  ""
                ) : (
                  <button style={{marginRight: 10}} onClick={this.onTicketDelete.bind(this)}>Delete</button>
                )
              }
              <button onClick={this.onTicketSubmit.bind(this)}>Submit</button>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
}
