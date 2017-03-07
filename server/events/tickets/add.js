Meteor.methods({
  "tickets.addOnsite"(userId, instanceId, tickets) {

    var updateObj = {};
    Object.keys(tickets).forEach(k => {
      updateObj[`tickets.${k}.payments.${userId}`] = false;
      Object.keys(tickets[k]).forEach(j => {
        updateObj[`tickets.${k}.discounts.${j}.qualifiers.${userId}`] = true;
      })
    });
    updateObj[`tickets.payables.${userId}`] = {
      method: "onsite"
    };

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
  },
  "tickets.switchToOnsite"(userId, instanceId, index) {
    const updateObj = {
      [`tickets.payables.${userId}`]: {
        method: "onsite"
      }
    }
    Instances.update(instanceId, {
      $set: updateObj
    })
  }
});
