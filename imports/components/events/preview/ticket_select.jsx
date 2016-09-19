import React, { Component } from "react";
import Modal from "react-modal";

import Games from "/imports/api/games/games.js";

export default class TicketSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typeList: ["venue"]
    };
  }

  valid() {
    return true;
  }

  total() {
    var tickets = Events.findOne().revenue.tickets;
    return this.state.typeList.map((type) => {
      return tickets[type].price;
    }).reduce((prev, cur) => {
      return prev + cur;
    });
  }

  value() {
    var total = 0;
    var tickets = Events.findOne().revenue.tickets;
    this.state.typeList.forEach((id) => {
      var ticket = tickets[id];
      total += tickets[id].price;
    })
    return {
      amount: (total * 100),
      ticketList: this.state.typeList
    }
  }

  onTicketSelect(id) {
    return (e) => {
      var target = e.target;
      while(!target.classList.contains("ticket-select")){
        target = target.parentNode;
      }
      if(!target.classList.contains("active")){
        this.state.typeList.push(id);
      }
      else {
        this.state.typeList.splice(this.state.typeList.indexOf(id), 1);
      }
      target.classList.toggle("active");
    }
  }

  render() {
    var event = Events.findOne();
    var tickets = event.revenue.tickets;
    var brackets = event.brackets;
    return (
      <div className="col">
        <div className="ticket-select active">
          <span>Venue Fee</span>
          <span>${ tickets["venue"].price }</span>
        </div>
        <div className="ticket-select" onClick={this.onTicketSelect("spectator").bind(this)}>
          <span>Spectator Fee</span>
          <span>${ tickets["spectator"].price }</span>
        </div>
        {
          brackets.map((bracket, index) => {
            return (
              <div className="ticket-select" onClick={this.onTicketSelect("bracket"+index).bind(this)}>
                <span>Entry to { bracket.name }</span>
                <span>${ tickets["bracket"+index].price }</span>
              </div>
            )
          })
        }
      </div>
    )

  }
}
