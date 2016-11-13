import Instances from "/imports/api/event/instance.js";
var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias, userID) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var cmd = {};
    if(userID && instance.access[userID][`bracketEntry${index}`].charge != null) {
      var chargeId = instance.access[userID][`bracketEntry${index}`].charge;
      stripe.refunds.create({
        charge: chargeId,
        reason: "requested_by_customer",
        amount: instance.tickets[`bracketEntry${index}`] - Math.round(instance.tickets[`bracketEntry${index}`] * 0.029)
      });
      cmd[`access.${userID}.bracketEntry${index}`] = {
        charge: null,
        paid: false
      };
      var objs = Object.keys(instance.access[userID]).filter((key) => {
        return key.match(/[0-9]+/) != null && instance.access[userID][key].paid;
      }).length;
      if(objs == 1) {
        var venueCharge = instance.access[userID]["venue"].charge;
        stripe.refunds.create({
          charge: venueCharge,
          reason: "requested_by_customer",
          amount: instance.tickets[`venue`] - parseInt(instance.tickets[`venue`] * 0.029)
        });
        cmd[`access.${userID}.venue`] = {
          charge: null,
          paid: false
        };
      }
    }
    Instances.update(instance._id, {
      $pull: {
        [`brackets.${index}.participants`]: {
          alias
        }
      },
      $set: cmd
    });
  },
  "events.brackets.startBracket"(id, index) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.inProgress`]: true
      }
    })
  },
  "events.brackets.updateMatchScore"(id, bracketNum, round, match, useP1, value) {
    console.log(id);
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0];
    var scoreField = useP1 ? "scoreOne" : "scoreTwo";
    Instances.update(instance._id, {
      $inc: {
        [`brackets.0.rounds.${bracketNum}.${round}.${match}.${scoreField}`]: value
      }
    })
  }
})
