import React from 'react';

export default class LinkToStripe extends React.Component {
  connectToStripe(event){
    if(!Meteor.user().profile.isStripeConnected){
      Meteor.linkWithStripe({
        stripe_landing: 'register',
        newAccountDetails: {
          'stripe_user[email]': Meteor.user().emails[0].address
        }
      }, function(err){
        var connected = true;
        if(err){
            toastr.error("Oops...")
        }
        else{
          Meteor.call("isStripeConnected", connected, function(err){
            if(err){
            }
            else{
              toastr.success("You are now connected!", "Stripe Link");
            }
          });
        }
      });
    }
    else{
      toastr.error("Seems that you already linked an account", "Stripe Link");
    }
  }

  render(){
    return (
      <div>
        <button onClick={this.connectToStripe.bind(this)}>Connect to Stripe</button>
      </div>
    )
  }
}
