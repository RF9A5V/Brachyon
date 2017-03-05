var stripe;
if(Meteor.isDevelopment) {
  stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);
}
else {
  // Failsafe for keeping from live.
  // Implement when tested on localhost.
  stripe = {};
}

Meteor.methods({
  "tickets.charge"(instanceId, index, userId) {
    const event = Events.findOne({ instances: instanceId });
    const instance = Instances.findOne(instanceId);
    const ticketObj = instance.tickets[index];
    const owner = Meteor.users.findOne(event.owner);
    const cb = () => {
      Instances.update(instanceId, {
        $set: {
          [`tickets.${index}.payments.${userId}`]: true,
          [`tickets.venue.payments.${userId}`]: true
        }
      })
    }
    if(instance.tickets.payables[userId].method == "online") {
      var amtToCharge = 0;
      if(!ticketObj.payments[userId]) {
        amtToCharge += ticketObj.price;
        ticketObj.discounts.forEach(d => {
          if(d.qualifiers[userId]) {
            amtToCharge -= d.price;
          }
        })
      }
      if(!instance.tickets.venue.payments[userId]) {
        amtToCharge += instance.tickets.venue.price;
      }

      if(amtToCharge == 0) {
        return;
      }
      const endCharge = Math.round((amtToCharge + 30) / (1 - 0.029));
      const fee = endCharge - amtToCharge;
      const method = Meteor.wrapAsync(stripe.charges.create, stripe.charges);
      try {
        method({
          amount: endCharge,
          destination: Meteor.users.findOne(event.owner).services.stripe.id,
          customer: Meteor.users.findOne(userId).stripeCustomerId,
          source: instance.tickets.payables[userId].token,
          application_fee: fee,
          currency: "usd"
        });
      }
      catch(e) {
        throw new Meteor.Error(403, "Issue with payment");
      }
      cb();
    }
    else {
      cb();
    }
  },
})
