Meteor.methods({
  "tickets.addOnsite"(userId, instanceId, index) {

    const updateObj = {
      [`tickets.venue.payments.${userId}`]: {
        method: "onsite"
      },
      [`tickets.${index}.payments.${userId}`]: {
        method: "onsite"
      }
    }

    Instances.update(instanceId, {
      $set: updateObj
    })
  },
  "tickets.addOnline"(userId, instanceId, index, token) {

    const updateObj = {
      [`tickets.venue.payments.${userId}`]: {
        method: "online",
        token
      },
      [`tickets.${index}.payments.${userId}`]: {
        method: "online",
        token
      }
    };

    Instances.update(instanceId, {
      $set: updateObj
    })
  }
});
