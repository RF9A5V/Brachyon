Meteor.methods({
  "tickets.addOnsite"(userId, instanceId, index) {
    Instances.update(instanceId, {
      $set: {
        [`tickets.venue.payments.${userId}`]: {
          method: "onsite"
        },
        [`tickets.${index}.payments.${userId}`]: {
          method: "onsite"
        }
      }
    })
  },
  "tickets.addOnline"(userId, instanceId, index, token) {
    Instances.update(instanceId, {
      $set: {
        [`tickets.venue.payments.${userId}`]: {
          method: "online",
          token
        },
        [`tickets.${index}.payments.${userId}`]: {
          method: "online",
          token
        }
      }
    })
  }
});
