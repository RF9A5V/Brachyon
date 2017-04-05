import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class TicketDetails extends Component {

  amountPaid(id) {
    var start = this.props.ticket.price;
    (this.props.ticket.discounts || []).forEach(d => {
      if(d.qualifiers[id]) {
        start -= d.price;
      }
    });
    return start;
  }

  render() {

    const instance = Instances.findOne();
    const payTypes = instance.tickets.payables;

    var total = 0;

    return (
      <div>
        <div className="row" style={{padding: 20}}>
          <div className="col-1">Username</div>
          <div className="col-1">Amount Paid</div>
          <div className="col-1">Discounts</div>
          <div className="col-2">Payment Type</div>
          <div className="col-1">Running Total</div>
        </div>
        {
          Object.keys(this.props.ticket.payments).map(p => {
            const user = Meteor.users.findOne(p);

            var style = {
              marginRight: 10,
              fontSize: 28,
              width: 30,
              textAlign: "center",
              color: this.props.ticket.payments[p] ? "#FF6000" : "#666"
            }

            const paidPrice = this.amountPaid(p);
            total += paidPrice;

            return (
              <div className="row table-row">
                <div className="col-1">
                  <span>{ user.username }</span>
                </div>
                <div className="col-1">
                  <span>${ (paidPrice / 100).toFixed(2) }</span>
                </div>
                <div className="col-1">
                  {
                    (this.props.ticket.discounts || []).filter(d => {
                      return d.qualifiers[p]
                    }).map(d => { return d.name }).join(", ")
                  }
                </div>
                <div className="col-2">
                  <span>{ payTypes[p].method == "online" ? (
                    <span className="row x-center">
                      <FontAwesome name="credit-card" style={style} />
                      Online
                    </span>
                  ) : (
                    <span className="row x-center">
                      <FontAwesome name="usd" style={style} />
                      On Site
                    </span>
                  ) }</span>
                </div>
                <div className="col-1">
                  ${ (total / 100).toFixed(2) }
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
