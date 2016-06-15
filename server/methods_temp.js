var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  "addCard": function(cardToken){
    if(Meteor.user().stripeCustomer == null){
      var customerCreate = Async.runSync(function(done){
        stripe.customers.create({
          source: cardToken
        }, function(err, response){
          done(err, response);
        })
      })
      if(customerCreate.error){
        console.log(customerCreate.error.message);
        throw new Meteor.Error(500, "stripe-error-create", customerCreate.error.message);
      }
      else{
        Meteor.users.update(Meteor.userId(), {$set: {stripeCustomer: customerCreate.response.id}});
        return
      }
    }
    else{
      var customerUpdate = Async.runSync(function(done){
        stripe.customers.update(Meteor.user().stripeCustomer,{
          source: cardToken
        }, function(err, response){
          done(err, response);
        })
      })
      if(customerUpdate.error){
        throw Meteor.Error(500, "stripe-error-update", customerUpdate.error.messgae);
      }
      else{
        return
      }
    }
  },
  "loadCardInfo": function(){
    return {
      "hasCard": false
    }
  },
  "chargeCard": function(cardToken){
    /*stripe.charges.create({
      amount: 500,
      currency: "usd",
      source: cardToken
    }, function(err, response){
      if(err){
        //throw new Meteor.error(500, "stripe-error", err.message);
        console.log("wow");
      }
      else{
        return response;
      }
    })*/
  }
});
