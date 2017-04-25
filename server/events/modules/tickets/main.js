import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.tickets.deleteDiscount"(id, bracketIndex, index) {
    const instance = Instances.findOne(id);
    var discounts = instance.tickets[bracketIndex].discounts;
    discounts.splice(index, 1);
    Instances.update(id, {
      $set: {
        [`tickets.${bracketIndex}.discounts`]: discounts
      }
    });
  }
})
