import React, { Component } from "react";
import Modal from "react-modal";
import FontAwesome from "react-fontawesome";

export default class TicketTypeModal extends Component {

  constructor(props) {
    super(props);
    const instance = Instances.findOne();
    this.state = {
      fees: {
        venue: instance.tickets.fees.venue.price
      }
    }
  }

  componentWillReceiveProps() {
    const instance = Instances.findOne();
    this.setState({
      fees: {
        venue: instance.tickets.fees.venue.price
      }
    })
  }

  render() {
    const instance = Instances.findOne();
    const ticketObj = instance.tickets;

    const isOnsite = ticketObj.paymentType == "onsite" || ticketObj.paymentType == "both";
    const isOnline = ticketObj.paymentType == "online" || ticketObj.paymentType == "both";

    const userId = Meteor.userId();

    const styleGenerator = (selected) => {
      return {
        width: 200,
        height: 100,
        borderBottom: "solid 2px #111",
        padding: 10,
        cursor: "pointer",
        backgroundColor: selected ? "#FF6000" : "#666"
      }
    }

    return (
      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose} style={{
        content: {
          width: "80vw",
          height: "80vh"
        }
      }}>
        <div className="row">
          <div style={{height: `calc(80vh - 40px)`}}>
            <div style={{marginBottom: 10}}>
              <div style={styleGenerator(true)}>
                Venue - ${(ticketObj.fees.venue.price / 100).toFixed(2)}
              </div>
            </div>
            <h4>Fees</h4>
            <div style={{height: `calc(${ticketObj.discounts.length ? 50 : 100}% - 80px)`, overflowY: "auto", marginBottom: ticketObj.discounts.length ? 10 : 0}}>
              {
                Object.keys(ticketObj.fees).filter(k => {
                  return !isNaN(k);
                }).map(k => {
                  return (
                    <div style={styleGenerator(this.state.fees[k] != null)} onClick={() => {
                      if(this.state.fees[k]) delete this.state.fees[k];
                      else this.state.fees[k] = ticketObj.fees[k].price;
                      this.forceUpdate()
                    }}>
                      <span style={{marginBottom: 10}}>Entry to Bracket {parseInt(k) + 1} - ${(ticketObj.fees[k].price / 100).toFixed(2)}</span>
                      <p>{ ticketObj.fees[k].description }</p>
                    </div>
                  )
                })
              }
            </div>
            {
              ticketObj.discounts.length ? (
                [
                  <h4>Discounts</h4>,
                  <div style={{height: "calc(50% - 100px)", overflowY: "auto"}}>
                    {
                      ticketObj.discounts.map(d => {
                        return (
                          <div style={styleGenerator(false)}>
                            <span style={{marginBottom: 10}}>{ d.name } - ${(d.price / 100).toFixed(2)}</span>
                            <p>{ d.description }</p>
                          </div>
                        )
                      })
                    }
                  </div>
                ]
              ) : (
                null
              )
            }
          </div>
          <div className="col-1 col x-center center" style={{marginLeft: 20}}>
            <h1>Total: ${
              (Object.keys(this.state.fees).reduce((a, b) => {
                return a + this.state.fees[b]
              }, 0) / 100).toFixed(2)
            }</h1>
            <div className="row center">
              {
                isOnsite ? (
                  <button style={{marginRight: 10}} onClick={() => {
                    this.props.onAcceptOnsite(Object.keys(this.state.fees));
                  }}>Pay Cash</button>
                ) : (
                  null
                )
              }
              {
                isOnline ? (
                  <button style={{marginRight: 10}} onClick={() => {
                    this.props.onAcceptOnline(Object.keys(this.state.fees));
                  }}>Pay Credit</button>
                ) : (
                  null
                )
              }
              <button onClick={() => {
                this.props.onClose();
              }}>Cancel</button>

            </div>
          </div>
        </div>
      </Modal>
    )
  }
}
