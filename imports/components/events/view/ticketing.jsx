import React, { Component } from 'react';

export default class TicketPanel extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="row">
        {
          this.props.tickets.map(function(ticket){
            return (
              <div className="ticket-bg col" style={{alignItems: 'flex-start'}}>
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
      </div>
    );
  }
}
