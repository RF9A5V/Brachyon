import React, { Component } from "react";
import Modal from "react-modal";
import moment from "moment";
import FontAwesome from "react-fontawesome";

export default class PaymentForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focus: 0,
      ready: false,
      activeCard: -1
    }
    console.log(this.props);
    Meteor.call("users.getStripeSources", Meteor.userId(), (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        this.setState({
          ready: true,
          cards: data
        })
      }
    })
  }

  componentWillReceiveProps() {
    this.setState({
      ready: false
    });
    Meteor.call("users.getStripeSources", Meteor.userId(), (err, data) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        this.setState({
          ready: true,
          cards: data
        })
      }
    })
  }

  shiftFocus(e) {
    this.ensureNumeric(e);
    if(e.target.value.length == 4) {
      this.setState({
        focus: Math.min(++this.state.focus, 3)
      }, () => {
        this.refs[this.state.focus].focus()
      });
    }
    if(e.target.value.length == 0) {
      this.setState({
        focus: Math.max(--this.state.focus, 0)
      }, () => {
        this.refs[this.state.focus].focus()
      })
    }
  }

  ensureNumeric(e) {
    while(isNaN(e.target.value) && e.target.value.length > 0) {
      e.target.value = e.target.value.slice(0, -1);
    }
  }

  value() {
    if(this.state.activeCard >= 0) {
      return {
        id: this.state.cards[this.state.activeCard].id
      }
    }
    return {
      object: "card",
      number: _.range(0, 4).map(i => {
        return this.refs[i].value;
      }).join(""),
      cvc: this.refs.cvv.value,
      exp_month: this.refs.month.value,
      exp_year: this.refs.year.value
    }
  }

  monthSelect() {
    return (
      <select ref="month">
        {
          _.range(1, 13).map(i => {
            if(i < 10) {
              i = "0" + i;
            }
            else {
              i = "" + i;
            }
            return (
              <option value={i}>{i}</option>
            )
          })
        }
      </select>
    )
  }

  yearSelect() {
    var currentYear = (new Date()).getFullYear();
    return (
      <select ref="year">
        {
          _.range(currentYear, currentYear + 10).map(y => {
            return (
              <option value={y}>
                {y}
              </option>
            )
          })
        }
      </select>
    )
  }

  cardSelect() {
    return (
      <div className="row" style={{flexWrap: "wrap"}}>
        {
          this.state.cards.map((card, i) => {
            return (
              <div className="row" style={{padding: 20, backgroundColor: this.state.activeCard == i ? "#333" : "#666", width: "calc(50% - 10px)", marginRight: 10, marginBottom: 10}} onClick={() => {
                this.setState({
                  activeCard: i
                })
              }}>
                <FontAwesome name={`cc-${card.brand.toLowerCase()}`} style={{fontSize: 40, marginRight: 20}} />
                <div className="col">
                  <span>Ends With { card.last4 }</span>
                  <span>{ card.exp_month } / { card.exp_year }</span>
                </div>
              </div>
            )
          })
        }
        <div className="row" style={{padding: 20, backgroundColor: "#666", width: "calc(50% - 10px)", marginRight: 10, backgroundColor: this.state.activeCard == -1 ? "#333" : "#666", marginBottom: 10}} onClick={() => {
          this.setState({
            activeCard: -1
          })
        }}>
          <FontAwesome name="credit-card" style={{fontSize: 40, marginRight: 20}} />
          <div>
            Add A Card
          </div>
        </div>
      </div>
    )

  }

  newCard() {
    return (
      <div className="col" style={{padding: 20}}>
        <label>Credit Card #</label>
        <div className="row" style={{marginBottom: 10}}>
          {
            _.range(0, 4).map(i => {
              return (
                <input type="text" ref={i} style={{margin: 0, marginRight: 5, width: "calc(25% - 5px)"}} maxLength={4} onChange={this.shiftFocus.bind(this)} onFocus={() => { this.state.focus = i }} />
              )
            })
          }
        </div>
        <div className="row">
          <div className="col col-3" style={{marginRight: 10}}>
            <label>CVV</label>
            <input ref="cvv" type="text" style={{margin: 0, width: "100%"}} onChange={this.ensureNumeric.bind(this)} />
          </div>
          <div className="col col-2" style={{marginRight: 10}}>
            <label>Exp. Month</label>
            { this.monthSelect() }
          </div>
          <div className="col col-2">
            <label>Exp. Year</label>
            { this.yearSelect() }
          </div>
        </div>
      </div>
    )
  }

  render() {

    if(!this.state.ready) {
      return null;
    }

    const total = (this.props.breakdown || []).reduce((a, b) => {
      return a + b.price - b.discounts.reduce((ac, d) => {
        return ac + d.price;
      }, 0)
    }, 0)

    const stripeFee = Math.round((total + 30) / (1 - 0.029)) - total;

    return (

      <Modal isOpen={this.props.open} onRequestClose={this.props.onClose}>
        <div className="col" style={{height: "100%"}}>
          <div className="row col-1">
            <div className="col-1" style={{padding: 20}}>
              {
                this.props.breakdown.map(i => {
                  return (
                    <div>
                      <div className="row x-center flex-pad">
                        <span>{ i.name }</span>
                        <span>${ (i.price / 100).toFixed(2) }</span>
                      </div>

                      {
                        i.discounts.map(d => {
                          return (
                            <div className="row x-center flex-pad" style={{marginLeft: 10}}>
                              <span>{ d.name }</span>
                              <span>- ${ (d.price / 100).toFixed(2) }</span>
                            </div>
                          )
                        })
                      }
                      <hr className="user-divider" />
                    </div>
                  )
                })
              }
              <div className="row x-center flex-pad">
                <span>Before Fees</span>
                <span>${ (total / 100).toFixed(2) }</span>
              </div>
              <div className="row x-center flex-pad">
                <span>Transaction Fee</span>
                <span>${ (stripeFee / 100).toFixed(2) }</span>
              </div>
              <hr className="user-divider" />
              <div className="row x-center flex-pad">
                <b>Total</b>
                <span>${ ((total + stripeFee) / 100).toFixed(2) }</span>
              </div>
            </div>
            <div className="col-2">
              { this.cardSelect() }
              {
                this.state.activeCard == -1 ? (
                  this.newCard()
                ) : (
                  null
                )
              }
            </div>
          </div>
          <div className="row center">
            <button onClick={() => {
              if(this.state.active) {
                return;
              }
              this.state.active = true;
              this.props.submit(this.value(), total + stripeFee, () => { this.setState({ active: false, focus: 0 }) });
            }}>Submit</button>
          </div>
        </div>
      </Modal>
    )
  }
}
