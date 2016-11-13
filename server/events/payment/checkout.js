import Instance from "/imports/api/event/instance.js";
var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  "events.checkout"(slug, obj) {
    var event = Events.findOne({ slug });
    var instance = Instances.findOne(event.instances.pop());
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    var ticketValues = 0;
    var price = 0;
    var cmd = {
      $set: {}
    };
    if(obj.tickets) {
      var ticketAccess = instance.access || {};
      obj.tickets.forEach(tick => {
        ticketValues += instance.tickets[tick];
      });
    }
    if(price + ticketValues != obj.baseAmount) {
      throw new Meteor.Error(403, "Invalid amount found for base price.");
    }
    if(obj.baseAmount > 0){
      Meteor.call("addCard", obj.token, (err) => {
        if(err) {
          throw err;
        }
        if(price == 0 && ticketValues > 0) {
          var user = Meteor.users.findOne(Meteor.userId());
          var cb = Meteor.bindEnvironment(function(err, response){
            if(err) {
              throw err;
            }
            else {
              var bracketPushCmd = {};
              var bracketSetCmd = {};
              var hasBrackets = false;
              obj.tickets.forEach(tick => {
                var match = tick.match(/[0-9]+/);
                if(match) {
                  bracketPushCmd[`brackets.${match}.participants`] = {
                    id: user._id,
                    alias: user.username
                  };
                }
                if(instance.tickets[tick] > 0) {
                  bracketSetCmd[`access.${user._id}.${tick}`] = {
                    charge: response.id,
                    paid: true
                  };
                }
              });
              if(Object.keys(bracketPushCmd).length > 0) {
                cmd["$push"] = bracketPushCmd;
              }
              if(Object.keys(bracketSetCmd).length > 0) {
                cmd["$set"] = bracketSetCmd;
              }
              Instances.update(instance._id, cmd);
            }
          });
          stripe.charges.create({
            amount: obj.amount,
            currency: "usd",
            customer: Meteor.user().stripeCustomer,
            card: obj.token,
            destination: Meteor.users.findOne(event.owner).services.stripe.id,
            application_fee: obj.amount - obj.baseAmount
          }, cb)
        }
      });
    }
    else if(Object.keys(cmd).length){
      obj.tickets.forEach(tick => {
        ticketValues += instance.tickets[tick];
        // cmd["$set"][`access.${}`]
      });
      Instances.update(instance._id, cmd);
    }
  },
  "events.issueTickets"(instanceID, tickets) {
    var pushCmd = {};
    var setCmd = {};
    var user = Meteor.users.findOne(Meteor.userId());
    tickets.forEach(ticket => {
      var match = ticket.match(/[0-9]+/);
      if(match) {
        pushCmd[`brackets.${match}.participants`] = {
          id: Meteor.userId(),
          alias: user.username
        };
      }
      setCmd[`access.${Meteor.userId()}.${ticket}`] = {
        paid: true,
        charge: null
      }
    });
    var cmd = {};
    if(Object.keys(pushCmd) > 0) {
      cmd["$push"] = pushCmd;
    }
    if(Object.keys(setCmd > 0)) {
      cmd["$set"] = setCmd;
    }
    Instances.update(instanceID, cmd);
    return;
  }
})
