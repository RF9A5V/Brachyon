import React, { Component } from "react";

export default class TicketPanel extends Component {
  render() {
    var self = this;
    if(!this.props.tickets) {
      return (
        <div></div>
      )
    }
    return (
      <div>
        {
          Object.keys(this.props.tickets).map(function(key){
            var ticket = self.props.tickets[key];
            return (
              <div className="ticket-block">
                <div className="row flex-pad x-center">
                  <b style={{fontSize: 20}}>{ ticket.name }</b>
                  <b>${ (ticket.price / 100).toFixed(2) }</b>
                </div>
                <div>
                  { ticket.description }
                </div>
                <div style={{textAlign: "right"}}>
                  <span>Limit: <i>{ticket.limit}</i></span>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
