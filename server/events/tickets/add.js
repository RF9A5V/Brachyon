Meteor.methods({
  "tickets.addOnsite"(userId, instanceId, tickets) {

    var updateObj = {};
    tickets.forEach(k => {
      updateObj[`tickets.fees.${k}.payments.${userId}`] = false;
    });
    updateObj[`tickets.payables.${userId}`] = {
      method: "onsite"
    };

    Instances.update(instanceId, {
      $set: updateObj
    })
  },
  "tickets.addOnline"(userId, instanceId, tickets, token) {

    var updateObj = {};
    tickets.forEach(k => {
      updateObj[`tickets.fees.${k}.payments.${userId}`] = false;
    });
    updateObj[`tickets.payables.${userId}`] = {
      method: "online",
      token
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
