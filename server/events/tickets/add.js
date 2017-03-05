Meteor.methods({
  "tickets.addOnsite"(userId, instanceId, index) {

    const updateObj = {
      [`tickets.venue.payments.${userId}`]: false,
      [`tickets.${index}.payments.${userId}`]: false,
      [`tickets.payables.${userId}`]: {
        method: "onsite"
      }
    }

    Instances.update(instanceId, {
      $set: updateObj
    })
  },
  "tickets.addOnline"(userId, instanceId, index, token) {

    const updateObj = {
      [`tickets.venue.payments.${userId}`]: false,
      [`tickets.${index}.payments.${userId}`]: false,
      [`tickets.payables.${userId}`]: {
        method: "online",
        token
      }
    };

    Instances.update(instanceId, {
      $set: updateObj
    })
  }
});
