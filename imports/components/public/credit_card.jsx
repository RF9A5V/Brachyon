import React from 'react';
import moment from "moment";

export default class CreditCardForm extends React.Component {

  closeModal(){
    this.props.closeHandler();
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
        //self.closeModal();
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
                else {
                  if(self.props.cb){
                    self.props.cb();
                  }
                  else {
                    toastr.success("Successfully got your payment!", "Success!");
                  }
                  self.closeModal();
                }
              })
            }
            else {
              Meteor.call("users.purchase_currency", self.props.amount, finalAmount, function(err) {
                if(err){
                  toastr.error(err.reason, "Error!");
                }
                else {
                  toastr.success(`Added $${(self.props.amount / 100).toFixed(2)} to your wallet!`, "Success!");
                  self.closeModal();
                }
              })
            }

          }
        })
      }
    })
  }
}
