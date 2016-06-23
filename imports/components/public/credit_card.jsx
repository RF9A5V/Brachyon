import React from 'react';

export default class CreditCardForm extends React.Component {

  connectToStripe(event){
    Meteor.linkWithStripe({
      stripe_landing: 'register',
      newAccountDetails: {
        'stripe_user[business_type]': 'non_profit',
        'stripe_user[product_category]': 'charity'
      }
    }, function(err){
      var connected = true;

      if(err){
        console.log('ERROR: ' + err);
        Meteor.call("hasStripeLink", !connected, function(err, response){
          if(err){
            alert(err.message);
          }
          else{
            alert("wow!");
          }
        });
      }
      else{
        Meteor.call("isStripeConnected", true, function(err, response){
          if(err){
            alert(err.message);
          }
          else{
            alert("yay!");
          }
        });
        console.log('NO ERROR ON LOGIN');
      }
    });
  }

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
        alert(response.error.message);
      }
      else{
        Meteor.call("addCard", response.id, function(err, response){
          if(err){
            alert(err.message);
          }
          else{
            //loadCardInfo();
            alert("Card Saved");
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
        <div>
          <button onClick={this.connectToStripe.bind(this)}>Connect to Stripe</button>
        </div>
      </div>
      )
  }
}
