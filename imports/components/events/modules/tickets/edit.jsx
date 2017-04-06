import React, { Component } from "react";
import FontAwesome from "react-fontawesome";

export default class EditTickets extends Component {

  constructor(props) {
    super(props);
    const { brackets, tickets } = Instances.findOne();
    if(tickets) {
      var obj = {};
      (brackets || []).forEach((_, i) => {
        obj[i] = tickets[i].discounts;
      });
      this.state = {
        discounts: obj,
        paymentType: tickets.paymentType
      };
    }
  }

  componentWillReceiveProps() {
    const { brackets, tickets } = Instances.findOne();
    if(tickets) {
      var obj = {};
      (brackets || []).forEach((_, i) => {
        obj[i] = tickets[i].discounts;
      });
      this.state = {
        discounts: obj,
        paymentType: tickets.paymentType
      };
    }
  }

  value() {
    const { brackets } = Instances.findOne();
    var obj = {
      venue: parseInt(parseFloat(this.refs.venue.value) * 100)
    };
    brackets.forEach((_, i) => {
      obj[i] = {
        price: parseInt(parseFloat(this.refs[i].value) * 100),
        discounts: this.state.discounts[i].map((d, j) => {
          const key = isNaN(d) ? j : d;
          if(!this.refs[`discount_name_${i}_${key}`].value || !this.refs[`discount_price_${i}_${key}`].value) {
            toastr.error("Fields must be filled in for discount.");
            throw new Error("Fill in details for discount.");
          }
          return {
            name: this.refs[`discount_name_${i}_${key}`].value,
            price: parseInt(parseFloat(this.refs[`discount_price_${i}_${key}`].value) * 100)
          }
        })
      }
    });
    return obj;
  }

  render() {
    const { tickets, brackets } = Instances.findOne();
    if(!this.props.status || !tickets) {
      return (
        <div>
          Ticket Descriptions go here!
        </div>
      )
    }
    return (
      <div className="col">
        <div className="row x-center" style={{marginBottom: 10}}>
          <div className="col-1">
            Venue Fee
          </div>
          <div className="col-1">
            $
            <input type="number" ref="venue" defaultValue={(tickets.venue.price / 100).toFixed(2)} style={{margin: 0, marginLeft: 10}}/>
          </div>
        </div>
        {
          brackets.map((_, i) => {
            return (
              <div className="col">
                <div className="row x-center" style={{marginBottom: 10}}>
                  <div className="col-1">
                    Bracket {i + 1}
                  </div>
                  <div className="col-1">
                    $
                    <input type="number" defaultValue={(tickets[i].price / 100).toFixed(2)} style={{margin: 0, marginLeft: 10}} ref={i}/>
                  </div>
                </div>
                <hr className="user-divider" />
                {
                  (this.state.discounts[i] || []).map((d, j) => {
                    const key = isNaN(d) ? j : d;

                    return (
                      <div className="row x-center" key={key} style={{marginBottom: 10}}>
                        <div className="col-1">
                          <input type="text" ref={"discount_name_" + i + "_" + key} defaultValue={d.name || ""} style={{margin: 0}} />
                        </div>
                        <div className="col-1">
                          $
                          <input type="number" ref={"discount_price_" + i + "_" + key} defaultValue={((d.price || 0) / 100).toFixed(2)} style={{margin: 0, marginLeft: 10, marginRight: 0}} />
                          <FontAwesome name="times" size="2x" onClick={() => {
                            const instance = Instances.findOne();
                            const ticket = instance.tickets[i];
                            if(key < (ticket.discounts || []).length) {
                              Meteor.call("events.tickets.deleteDiscount", instance._id, i, key, (e) => {
                                if(e) {
                                  toastr.error(e.reason);
                                  return;
                                }
                                else {
                                  this.state.discounts[i].splice(j, 1);
                                  this.forceUpdate();
                                }
                              })
                            }
                          }} />
                        </div>
                      </div>
                    )
                  })
                }
                <div className="row center">
                  <button onClick={() => {
                    if(this.state.discounts[i]) {
                      this.state.discounts[i].push(this.state.discounts[i][this.state.discounts[i].length - 1] + 1)
                    }
                    else {
                      this.state.discounts[i] = [0];
                    }
                    this.forceUpdate();
                  }}>Add Discount</button>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
