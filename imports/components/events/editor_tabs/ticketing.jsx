import React, { Component } from 'react';
import FontAwesome from 'react-fontawesome';

import HoverBlock from '../../public/hover_block.jsx';
import TicketingForm from './ticketing_form.jsx';

import Tickets from '/imports/api/ticketing/ticketing.js';

export default class Ticketing extends Component {

  componentWillMount() {
    this.setState({
      tickets: this.props.tickets,
      x: 0,
      y: 0,
      open: false
    })
  }

  ticketing() {
    return Tickets.find().fetch()[0];
  }

  close(){
    this.setState({
      open: false
    })
  }

  createTicket() {
    self = this;
    Meteor.call('ticketing.create_ticket', this.props._id, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else {
        toastr.success('Created ticket!');
        self.setState({
          tickets: self.ticketing().tickets
        })
      }
    })

  }

  editTicket(ticket, index) {
    return function(e){
      el = e.target;
      if(el.classList.contains('ticket-delete')){
        return;
      }
      while(!el.classList.contains('ticket-bg') && (el = el.parentElement));
      rect = el.getBoundingClientRect();
      this.setState({
        x: rect.left,
        y: rect.top,
        open: true,
        index
      });
    }
  }

  updateTicket(attrs) {
    self = this;
    this.state.tickets[this.state.index] = attrs;
    Meteor.call('ticketing.update_ticket', this.props._id, this.state.tickets, this.state.index, function(err){
      if(err){
        toastr.error('Issue updating ticket.')
      }
      else {
        self.setState({
          open: false
        })
        toastr.success('Successfully updated ticket.')
      }
    })
  }

  createTicketing() {
    Meteor.call('events.create_ticketing', this.props.id, function(err){
      if(err){
        toastr.error('Error in creating ticketing.');
      }
      else {
        toastr.success('Successfully set up ticketing.');
      }
    })
  }

  deleteTicket(e) {
    self = this;
    Meteor.call('ticketing.delete_ticket', this.props._id, this.state.index, function(err){
      if(err){
        toastr.error('Error in deleting ticket.');
      }
      else {
        toastr.success('Deleted ticket.')
        self.forceUpdate();
      }
    })
  }

  render() {
    self = this;
    if(!this.props._id){
      return (
        <div>
          <button onClick={this.createTicketing.bind(this)}>Create Ticketing</button>
        </div>
      )
    }
    return (
      <div className="col x-center">
        {
          this.props.tickets.map(function(ticket, index){
            return (
              <div className="ticket-bg col" style={{alignItems: 'flex-start', justifyContent: 'flex-start'}} onClick={self.editTicket(ticket, index).bind(self)}>
                <a href="#" style={{alignSelf: 'flex-end'}} className="ticket-delete" onClick={self.deleteTicket.bind(self)}>
                  <FontAwesome name="times" className="ticket-delete" />
                </a>
                <div className="row">
                  <h2>{ticket.name}</h2>
                </div>
                <div>
                  {ticket.description}
                </div>
                <div className="col-1 row" style={{alignItems: 'flex-end', justifyContent: 'space-between', alignSelf: 'stretch'}}>
                  <span>
                    ${(ticket.amount / 100).toFixed(2)}
                  </span>
                  <span>
                    <i>0</i>
                    &nbsp;&nbsp;out of&nbsp;
                    <i>{ticket.limit}</i>
                  </span>
                </div>
              </div>
            );
          })
        }
        <div className="ticket-bg" onClick={this.createTicket.bind(this)}>
          Create A Ticket
        </div>
        {
          this.state.open ? (
            <HoverBlock x={this.state.x + 340} y={this.state.y} open={this.state.open} handler={this.close.bind(this)}>
              <TicketingForm {...this.state.tickets[this.state.index]} handler={this.updateTicket.bind(this)} />
            </HoverBlock>
          ) : (
            ""
          )
        }
      </div>
    );
  }
}
