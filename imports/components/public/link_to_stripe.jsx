import React from 'react';

export default class LinkToStripe extends React.Component {
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
        Meteor.call("isStripeConnected", !connected, function(err){
          if(err){
            alert(err.message);
          }
          else{
            alert("wow!");
          }
        });
      }
      else{
        Meteor.call("isStripeConnected", connected, function(err){
          if(err){
            toastr.success("You are now connected!", "Stripe Link");
          }
          else{
            toastr.error("Oh no... seems we were rejected", "Stripe Link");
          }
        });
      }
    });
  }

  render(){
    return (
      <div>
        <button onClick={this.connectToStripe.bind(this)}>Connect to Stripe</button>
      </div>
    )
  }
}
