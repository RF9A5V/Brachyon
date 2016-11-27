import React, { Component } from "react";
import moment from "moment";
import { browserHistory } from "react-router";

import Games from "/imports/api/games/games.js";

export default class CheckoutMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      month: 0
    };
  }

  monthOptions() {
    var options = [];
    for(var i = 0; i < 12; i ++){
      options.push(i);
    }
    return options.map(i => {
      return (
        <option value={i}>{moment().month(i).format("MMMM")}</option>
      )
    })
  }

  yearOptions() {
    var options = [
      (
        <option value={moment().year()}>
          { moment().year() }
        </option>
      )
    ];
    for(var i = 1; i < 10; i ++) {
      options.push(
        <option value={moment().year() + i}>
          { moment().year() + i }
        </option>
      );
    }
    return options;
  }

  stateOptions() {
    var states = {
      "AL": "Alabama",
      "AK": "Alaska",
      "AS": "American Samoa",
      "AZ": "Arizona",
      "AR": "Arkansas",
      "CA": "California",
      "CO": "Colorado",
      "CT": "Connecticut",
      "DE": "Delaware",
      "DC": "District Of Columbia",
      "FM": "Federated States Of Micronesia",
      "FL": "Florida",
      "GA": "Georgia",
      "GU": "Guam",
      "HI": "Hawaii",
      "ID": "Idaho",
      "IL": "Illinois",
      "IN": "Indiana",
      "IA": "Iowa",
      "KS": "Kansas",
      "KY": "Kentucky",
      "LA": "Louisiana",
      "ME": "Maine",
      "MH": "Marshall Islands",
      "MD": "Maryland",
      "MA": "Massachusetts",
      "MI": "Michigan",
      "MN": "Minnesota",
      "MS": "Mississippi",
      "MO": "Missouri",
      "MT": "Montana",
      "NE": "Nebraska",
      "NV": "Nevada",
      "NH": "New Hampshire",
      "NJ": "New Jersey",
      "NM": "New Mexico",
      "NY": "New York",
      "NC": "North Carolina",
      "ND": "North Dakota",
      "MP": "Northern Mariana Islands",
      "OH": "Ohio",
      "OK": "Oklahoma",
      "OR": "Oregon",
      "PW": "Palau",
      "PA": "Pennsylvania",
      "PR": "Puerto Rico",
      "RI": "Rhode Island",
      "SC": "South Carolina",
      "SD": "South Dakota",
      "TN": "Tennessee",
      "TX": "Texas",
      "UT": "Utah",
      "VT": "Vermont",
      "VI": "Virgin Islands",
      "VA": "Virginia",
      "WA": "Washington",
      "WV": "West Virginia",
      "WI": "Wisconsin",
      "WY": "Wyoming"
    }
    return (
      <select style={{backgroundColor: "#666", padding: 10}} ref="state">
        {
          Object.keys(states).map(key => {
            return (
              <option value={key}>{ states[key] }</option>
            )
          })
        }
      </select>
    )
  }

  onMonthChange() {
    this.forceUpdate();
  }

  ticketBreakdown() {
    var tickets = this.props.cart.tickets;
    if(!tickets || tickets.length == 0) {
      return "";
    }
    return (
      <div style={{marginBottom: 20}}>
        <h3 style={{marginBottom: 10}}>
          Tickets
        </h3>
        {
          tickets.map(key => {
            var ticketName = "";
            var instance = Instances.findOne();
            var ticketName = isNaN(key) ? key.slice(0, 1).toUpperCase() + key.slice(1) : "Entry to " + Games.findOne(instance.brackets[key].game).name + " bracket";
            return (
              <div className="row flex-pad" style={{marginBottom: 10}}>
                <h5>
                  { ticketName }
                </h5>
                <span>
                  ${ (instance.tickets[key].price / 100).toFixed(2) }
                </span>
              </div>
            )
          })
        }
      </div>
    );
  }

  tierBreakdown() {
    var tier = this.props.cart.tier;
    if(tier === undefined || tier === null || tier < 0) {
      return "";
    }
    tier = Events.findOne().crowdfunding.tiers[this.props.cart.tier];
    return (
      <div style={{marginBottom: 20}}>
        <h3 style={{marginBottom: 10}}>Tiers</h3>
        <div className="row flex-pad">
          <h5>{ tier.name }</h5>
          <span>${ (tier.price / 100).toFixed(2) }</span>
        </div>
      </div>
    )
  }

  totalBreakdown() {
    if(this.props.cart == null) {
      return "";
    }
    if(Object.keys(this.props.cart).length == 0) {
      return "";
    }
    var tierPrice = Events.findOne().crowdfunding.tiers[this.props.cart.tier].price;
    var ticketPrice = 0;
    var instance = Instances.findOne();
    (this.props.cart.tickets || []).forEach(key => {
      ticketPrice += instance.tickets[key].price;
    });
    return (
      <div>
        <hr />
        <div className="row flex-pad">
          <h5>Total</h5>
          <span>${ ((tierPrice + ticketPrice) / 100).toFixed(2) }</span>
        </div>
      </div>
    )
  }

  onCardValueChange(segment) {
    return (e) => {
      var value = e.target.value;
      if(value.length >= 4) {
        e.target.value = value.slice(0, 4);
        if(segment < 3) {
          this.refs[`ccn${segment + 1}`].focus();
        }
      }
      if(value.length == 0 && segment > 0) {
        this.refs[`ccn${segment - 1}`].focus();
      }
    }
  }

  onPaymentSubmit() {
    var cardDetails = {
      exp_month: parseInt(this.refs.month.value) + 1,
      exp_year: this.refs.year.value,
      number: [0, 1, 2, 3].map(i => { return this.refs[`ccn${i}`].value }).join(""),
      address_city: this.refs.city.value,
      address_line1: this.refs.address.value,
      address_state: this.refs.state.value,
      address_zip: this.refs.zip.value,
      cvc: this.refs.cvv.value,
      name: this.refs.name.value
    };
    Stripe.createToken(cardDetails, (respCode, response) => {
      if(respCode != 200) {
        toastr.error(respCode, "Error!");
      }
      else {
        Meteor.call("addCard", response.id, (err) => {
          if(err) {
            return toastr.error(err.reason, "Error!");
          }
          var tierPrice = Events.findOne().crowdfunding.tiers[this.props.cart.tier].price;
          var ticketPrice = 0;
          var instance = Instances.findOne();
          (this.props.cart.tickets || []).forEach(key => {
            ticketPrice += instance.tickets[key].price;
          });
          var saveCharge = (err) => {
            if(err) {
              return toastr.error(err.reason, "Error!");
            }
            else {
              toastr.success("Done bruh", "Success!");
              browserHistory.push(`/events/${Events.findOne().slug}/show`);
            }
          };
          if(ticketPrice > 0) {
            Meteor.call("chargeCard", Events.findOne().owner, ticketPrice, response.id, (err) => {
              if(err) {
                return toastr.error(err.reason, "Error!");
              }
              Meteor.call("events.saveCFCharge", Events.findOne()._id, tierPrice, response.id, saveCharge);
            });
          }
          else if(tierPrice > 0) {
            Meteor.call("events.saveCFCharge", Events.findOne()._id, tierPrice, response.id, saveCharge);
          }
        })
      }
    })
  }

  render() {
    return (
      <div className="col-2 checkout-main">
        <div className="row center">
          <h3>Checkout</h3>
        </div>
        <div className="row">
          { /* Payment */ }
          <div style={{width: "50%", padding: 20}}>
            <label>Cardholder Name</label>
            <div className="row" style={{width: "100%"}}>
              <input className="col-1" type="text" style={{marginTop: 0, marginRight: 0}} ref="name" />
            </div>
            <label>Billing Address</label>
            <div className="row" style={{width: "100%"}}>
              <input className="col-1" type="text" style={{marginTop: 0, marginRight: 0}} ref="address" />
            </div>
            <label>Billing City</label>
            <div className="row" style={{width: "100%"}}>
              <input className="col-1" type="text" style={{marginTop: 0, marginRight: 0}} ref="city" />
            </div>
            <div className="row" style={{width: "100%"}}>
              <div className="col col-1" style={{marginRight: 10}}>
                <label>Billing State</label>
                { this.stateOptions() }
              </div>
              <div className="col col-1">
                <label>Billing ZIP</label>
                <input type="text" style={{marginTop: 0, marginRight: 0, minWidth: 0}} ref="zip"/>
              </div>
            </div>
            <label>Credit Card Number</label>
            <div className="row" style={{marginBottom: 20}}>
              {
                [0, 1, 2, 3].map(i => {
                  return (
                    <input className="col-1" type="text" ref={`ccn${i}`} style={{marginTop: 0, marginRight: i == 3 ? 0 : 10, minWidth: 0, marginBottom: 0}} onChange={this.onCardValueChange(i)} />
                  )
                })
              }
            </div>
            <div className="row">
              <div className="col col-1" style={{marginRight: 20}}>
                <label>Expiration Date</label>
                <div className="row">
                  <select defaultValue={0} ref="months" onChange={this.onMonthChange.bind(this)} style={{padding: 10, backgroundColor: "#666", marginRight: 10}} ref="month">
                    { this.monthOptions() }
                  </select>
                  <select defaultValue={0} ref="days" style={{padding: 10, backgroundColor: "#666"}} ref="year">
                    { this.yearOptions() }
                  </select>
                </div>
              </div>
              <div className="col">
                <label>CVV</label>
                <input type="text" style={{margin: 0}} ref="cvv" />
              </div>
            </div>
          </div>
          { /* Breakdown */ }
          <div style={{width: "50%", padding: 20}}>
            { this.tierBreakdown() }
            { this.ticketBreakdown() }
            { this.totalBreakdown() }
            <div className="row center">
              <button onClick={this.onPaymentSubmit.bind(this)}>
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
