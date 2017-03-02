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
  }
});
