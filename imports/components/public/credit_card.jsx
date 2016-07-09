import React from 'react';

export default class CreditCardForm extends React.Component {

  closeModal(){
    console.log(this.props.closeHandler)
    this.props.closeHandler();
  }

  calcStripeFee() {
    const stripeFixedFee = 30
    const stripePercentFee = 0.029
    var finalAmount = (this.props.amount + stripeFixedFee)/(1 - stripePercentFee)

    return finalAmount
  }


  submitPayment(event){
    event.preventDefault();

    var self = this;
    var finalAmount = Math.round(this.calcStripeFee());

    var cardDetails = {
      "number": this.refs.cardNumber.value,
      "cvc": this.refs.cvc.value,
      "exp_month": this.refs.expMoth.value,
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
            //loadCardInfo();
            Meteor.call("chargeCard", self.props.payableTo, finalAmount, function(err, res){
              if(err){
                toastr.error(err.message);
              }
            })
            self.closeModal();
          }
        })
      }
    })
  }

  render () {
    var finalAmount = this.calcStripeFee();
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
          <input type="submit" value={`Pay $${(finalAmount / 100).toFixed(2)}`}/>
        </form>
      </div>
      )
  }
}
