import React, { Component } from "react";
import moment from "moment";
import FontAwesome from "react-fontawesome";

// Endpoint Process

export default class CardPaymentProcess extends Component {

  constructor(props) {
    super(props);
    var self = this;
    var useHistory = false;
    var customer = Meteor.call("user.getStripeCustomerData", (a, b) => {
      this.state.cards = b.result.data;
    });
    this.state = {
      customerLoaded: useHistory,
      cards: [],
      usePrevious: false,
      cardID: null
    };
  }

  valid() {
    // Skipping this bit for now, gotta test the actual payment stuff first.
    return true;
  }

  value() {
    if(this.state.cardID == null) {
      var cardNumber = [0, 1, 2, 3].map((val) => {
        return this.refs[`card_seg_${val}`].value
      }).join('');

      var cardDetails = {
        "number": cardNumber,
        "cvc": this.refs.cvc.value,
        "exp_month": this.refs.expMonth.value,
        "exp_year": this.refs.expYear.value
      }
      console.log(this.calcStripeFee());
      Stripe.createToken(cardDetails, (err, rez) => {
        this.props.cb({
          addCard: true,
          token: rez.id,
          amount: this.calcStripeFee()
        })
      });
    }
    else {
      this.props.cb({
        addCard: false,
        token: this.state.cardID,
        amount: this.calcStripeFee(),
        baseAmount: this.props.amount
      })
    }
  }

  calcStripeFee() {
    const stripeFixedFee = 30;
    const stripePercentFee = 0.029;
    return Math.round((this.props.amount + stripeFixedFee)/(1 - stripePercentFee));
  }

  monthOptions() {
    var months = [];
    for(var i = 0; i < 12; i ++){
      var month = moment().month(i);
      months.push({
        month: month.format("MMM"),
        value: i + 1
      })
    }
    return months.map(function(month){
      return (
        <option value={month.value}>{month.month}</option>
      )
    })
  }

  yearOptions() {
    var currentYear = moment().year();
    var years = [];
    for(var i = 0; i < 20; i ++){
      years.push(currentYear + i);
    }
    return years.map(function(year) {
      return (
        <option value={year}>{year}</option>
      )
    })
  }

  cardIcon(brand) {
    if(brand == "Visa") {
      return <FontAwesome size="3x" name="cc-visa"/>
    }
    else if(brand == "MasterCard") {
      return <FontAwesome size="3x" name="cc-mastercard" />
    }
    else if(brand == "Discover") {
      return <FontAwesome size="3x" name="cc-discover" />
    }
  }

  onSetCard(cardID){
    return (e) => {
      this.setState({
        cardID
      })
    }
  }

  render () {
    var finalAmount = this.calcStripeFee();
    var self = this;
    return (
      <div className="col">
        <div className="col x-center">
          {
            this.state.cards.map((card) => {
              return (
                <div className="row center">
                  <div className="card-select row x-center" onClick={this.onSetCard(card.id).bind(this)} style={{backgroundColor: this.state.cardID == card.id ? "#050" : "inherit"}}>
                    {
                      this.cardIcon(card.brand)
                    }
                    <div className="col" style={{alignItems: "flex-start", marginLeft: 10}}>
                      <span>
                        {card.last4}
                      </span>
                      <span>
                        {card.exp_month}/{card.exp_year}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div className="row center">
            <div className="card-select row x-center" onClick={this.onSetCard(null).bind(this)} style={{backgroundColor: this.state.cardID == null ? "#050" : "inherit"}}>
              <FontAwesome size="2x" name="plus" />
              <span style={{marginLeft: 10}}>Add Card</span>
            </div>
          </div>
        </div>
        <form className="payment-form">
          {
            this.state.cardID == null ? (
              <div className="col">
                <div className="row center" style={{marginBottom: 20}}>
                  <div className="col">
                    <label className="text-success"> Card Number </label>
                    <div className="row">
                      {
                        [0, 1, 2, 3].map(function(val){
                          return (
                            <input
                              type="text"
                              ref={`card_seg_${val}`}
                              maxLength={4}
                              style={{ width: 50, marginRight: 10, marginTop: 0 }}
                              onChange={(e) => {
                                if(e.target.value.length >= 4 && val < 3){
                                  self.refs[`card_seg_${val+1}`].focus()
                                }
                                else if(e.target.value.length == 0 && val > 0){
                                  self.refs[`card_seg_${val-1}`].focus()
                                }
                              }}
                            />
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className="row center" style={{marginBottom: 20}}>
                  <div className="col">
                    <label>Exp. Mo.</label>
                    <select style={{width: 100, padding: 10}} ref="expMonth">
                      {
                        this.monthOptions()
                      }
                    </select>
                  </div>
                  <div className="col" style={{marginLeft: 20}}>
                    <label>Exp. Yr.</label>
                    <select style={{width: 100, padding: 10}} ref="expYear">
                      {
                        this.yearOptions()
                      }
                    </select>
                  </div>
                  <div className="col" style={{marginLeft: 20}}>
                    <label>CVC</label>
                    <input
                      type="text"
                      maxLength={4}
                      ref="cvc"
                      placeholder="CVC"
                      style={{width: 50, margin: 0}}
                    />
                  </div>
                </div>
              </div>
            ) : (
              ""
            )
          }
          <div className="col x-center">
            <div className="row flex-pad" style={{width: 300}}>
              <label>Base Amount</label>
              <label>{ (this.props.amount / 100).toFixed(2) }</label>
            </div>
            <div className="row flex-pad" style={{width: 300}}>
              <label>Processing Fee<sup>?</sup></label>
              <label>{ ((finalAmount - this.props.amount) / 100).toFixed(2) }</label>
            </div>
            <div className="row flex-pad" style={{width: 300}}>
              <label>Total</label>
              <label>{(finalAmount / 100).toFixed(2)}</label>
            </div>
          </div>
        </form>
      </div>
    )
  }
}
