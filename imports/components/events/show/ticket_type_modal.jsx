import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class OnlineModal extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appliedTickets: {
        venue: {}
      }
    }
  }

  componentWillReceiveProps() {
    this.setState({
      appliedTickets: {
        venue: {}
      }
    })
  }

  render() {
    const instance = Instances.findOne();
    const ticketObj = instance.tickets;

    const isOnsite = ticketObj.paymentType == "onsite" || ticketObj.paymentType == "both";
    const isOnline = ticketObj.paymentType == "online" || ticketObj.paymentType == "both";

    const currentTotal = Object.keys(this.state.appliedTickets).reduce((a, b) => {
      const tick = ticketObj[b];
      return a + tick.price - Object.keys(this.state.appliedTickets[b]).reduce((ac, d) => {
        return ac + tick.discounts[d].price;
      }, 0)
    }, 0);

    const userId = Meteor.userId();

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="row" style={{height: "100%", margin: "0 auto"}}>
          <div className="col col-1">
            {
              Object.keys(instance.tickets).map(k => {
                if(k == "payables" || k == "paymentType") {
                  return null;
                }
                let tick = instance.tickets[k];
                return (
                  <div className="col">
                    <div className="row x-center" style={{marginBottom: 10}}>
                      <input type="checkbox" style={{margin: 0, marginRight: 10}} checked={this.state.appliedTickets[k] != null || tick.payments[userId] != null} onClick={() => {
                        if(k == "venue") return;
                        if(tick.payments[userId] != null) return;
                        if(this.state.appliedTickets[k]) {
                          delete this.state.appliedTickets[k];
                        }
                        else {
                          this.state.appliedTickets[k] = {};
                        }
                        this.forceUpdate();
                      }} />
                      <span className="col-1" style={{textAlign: "left"}}>{isNaN(k) ? k[0].toUpperCase() + k.slice(1) : "Entry to Bracket " + (parseInt(k) + 1)} (${(tick.price / 100).toFixed(2)})</span>
                    </div>
                    {
                      (instance.tickets[k].discounts || []).map((d, i) => {
                        return (
                          <div className="row x-center" style={{marginLeft: 20, marginBottom: 10}}>
                            <input type="checkbox" style={{margin: 0, marginRight: 10}} checked={(this.state.appliedTickets[k] && this.state.appliedTickets[k][i]) || d.qualifiers[userId] != null} onClick={() => {
                              if(d.qualifiers[userId] != null) return;
                              if(!this.state.appliedTickets[k]) {
                                this.state.appliedTickets[k] = {
                                  [i]: true
                                }
                              }
                              else {
                                if(this.state.appliedTickets[k][i]) {
                                  delete this.state.appliedTickets[k][i];
                                }
                                else {
                                  this.state.appliedTickets[k][i] = true
                                }
                              }
                              this.forceUpdate();
                            }} />
                            <span>{ d.name } (${(d.price / 100).toFixed(2)})</span>
                          </div>
                        )
                      })
                    }
                  </div>
                )
              })
            }
          </div>
          <div className="col col-1">
            <h1>Total Price</h1>
            <span>${ (currentTotal / 100).toFixed(2) }</span>
          </div>
        </div>
        <div className="row center">
          {
            isOnsite ? (
              <button style={{marginRight: 10}} onClick={() => { this.props.onAcceptOnsite(this.state.appliedTickets) }}>Pay On Site</button>
            ) : (
              null
            )
          }
          {
            isOnline ? (
              <button style={{marginRight: 10}} onClick={() => { this.props.onAcceptOnline(this.state.appliedTickets) }}>Pay Online</button>
            ) : (
              null
            )
          }
          <button onClick={this.props.onClose}>Cancel</button>
        </div>
      </Modal>
    )
  }
}
