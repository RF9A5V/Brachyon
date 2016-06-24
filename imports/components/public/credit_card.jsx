import React from 'react';

export default class CreditCardForm extends React.Component {

  submitPayment(event){
    event.preventDefault();

    var cardDetails = {
      "number": this.refs.cardNumber.value,
      "cvc": this.refs.cvc.value,
      "exp_month": this.refs.expMoth.value,
      "exp_year": this.refs.expYear.value
    }

    Stripe.createToken(cardDetails, function(status, response){
      if(response.error){
        toastr.error(response.error.message);
      }
      else{
        Meteor.call("addCard", response.id, function(err, response){
          if(err){
            toastr.error(err.message);
          }
          else{
            //loadCardInfo();
            toastr.success("Card Saved");
          }
        })
      }
    })
  }

  render () {
    return (
      <div>
        <form class="payment-form" onSubmit={this.submitPayment.bind(this)}>
          <div class="row">
            <div class="col">
              <label class="text-success"> Card Number </label>
              <input
                type="text"
                ref="cardNumber"
                class=""
                placeholder="Card Number"
              />
            </div>
          </div>
          <div class="row">
            <div class="col">
              <label>Exp. Mo.</label>
              <input
                type="text"
                ref="expMoth"
                class=""
                placeholder="Exp. Mo."
              />
            </div>
            <div class="col">
              <label>Exp. Yr.</label>
              <input
                type="text"
                ref="expYear"
                class=""
                placeholder="Exp. Yr."
              />
            </div>
            <div class="col">
              <label>CVC</label>
              <input
                type="text"
                ref="cvc"
                class=""
                placeholder="CVC"
              />
            </div>
          </div>
          <input type="submit"/>
        </form>
      </div>
      )
  }
}
