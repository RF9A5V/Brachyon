import React from 'react';
import moment from "moment";

export default class CreditCardForm extends React.Component {

  closeModal(){
    this.props.closeHandler();
  }

  calcStripeFee() {
    const stripeFixedFee = 30;
    const stripePercentFee = 0.029;
    var finalAmount = (this.props.amount + stripeFixedFee)/(1 - stripePercentFee);

    return finalAmount;
  }


  submitPayment(event){
    event.preventDefault();

    var self = this;
    var finalAmount = Math.round(this.calcStripeFee());

    var cardNumber = [0, 1, 2, 3].map(function(val){
      return self.refs[`card_seg_${val}`].value
    }).join('');

    var cardDetails = {
      "number": cardNumber,
      "cvc": this.refs.cvc.value,
      "exp_month": this.refs.expMonth.value,
      "exp_year": this.refs.expYear.value
    }

    Stripe.createToken(cardDetails, function(status, response){
      if(response.error){
        toastr.error(response.error.message);
        self.closeModal();
      }
      else{
        Meteor.call("addCard", response.id, function(err, response){
          if(err){
            toastr.error(err.message);
          }
          else{
            if(self.props.payableTo){
              //loadCardInfo();
              Meteor.call("chargeCard", self.props.payableTo, finalAmount, function(err, res){
                if(err){
                  toastr.error(err.message);
                }
              })
            }
            else {
              Meteor.call("users.purchase_currency", self.props.amount, finalAmount, function(err) {
                if(err){
                  toastr.error(err.reason, "Error!");
                }
                else {
                  toastr.success("Successfully purchased currency.", "Success!");
                }
              })
            }
            toastr.success("Successfully got your payment!", "Success!")
            self.closeModal();
          }
        })
      }
    })
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

  render () {
    var finalAmount = this.calcStripeFee();
    var self = this;
    return (
      <div>
        <form className="payment-form" onSubmit={this.submitPayment.bind(this)}>
          <div className="row" style={{marginBottom: 20}}>
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
          <div className="row">
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
          <br />
          <div className="col">
            <div className="row">
              <label className="col-1">Base Amount</label>
              <span className="col-1">{ (this.props.amount / 100).toFixed(2) }</span>
              <div className="col-1"></div>
            </div>
            <div className="row">
              <label className="col-1">Processing Fee<sup>?</sup></label>
              <div className="col col-1">
                <span>{ ((finalAmount - this.props.amount) / 100).toFixed(2) }</span>
              </div>
              <div className="col-1"></div>
            </div>
            <div className="row">
              <label className="col-1">Total</label>
              <div className="col col-1">
                <span>{(finalAmount / 100).toFixed(2)}</span>
              </div>
              <div className="col-1"></div>
            </div>
          </div>

          <input type="submit" value={`Pay $${(finalAmount / 100).toFixed(2)}`}/>
        </form>
      </div>
      )
  }
}
