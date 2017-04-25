var stripe = {};

Meteor.methods({
  "users.addStripeSource"(userId, obj) {
    var user = Meteor.users.findOne(userId);
    if(!user.stripeCustomerId) {
      obj.email = user.emails[0].address;
      var call = Meteor.wrapAsync(stripe.customers.create, stripe.customers);
      var res = call({
        source: obj
      });
      Meteor.users.update(userId, {
        $set: {
          stripeCustomerId: res.id
        }
      });
      return res.sources.data[0].id;
    }
    else {
      var call = Meteor.wrapAsync(stripe.customers.createSource, stripe.customers);
      var res = call(user.stripeCustomerId, {
        source: obj
      });
      return res.id;
    }
  },
  "users.getStripeSources"(userId) {
    if(Meteor.userId() != userId) {
      throw new Meteor.Error(403, "Can't access this unless you are the user!");
    }
    var user = Meteor.users.findOne(userId);
    var call = Meteor.wrapAsync(stripe.customers.retrieve, stripe.customers);
    var res;
    if(user.stripeCustomerId) {
      res = call(user.stripeCustomerId);
    }
    if(!res) {
      return [];
    }
    return res.sources.data.map(d => {
      return {
        id: d.id,
        last4: d.last4,
        brand: d.brand,
        exp_month: d.exp_month,
        exp_year: d.exp_year
      }
    })
  }
})
