Meteor.methods({
  "tickets.removePayment"(instanceId, index, userId) {
    var instance = Instances.findOne(instanceId);
    var bracketLen = instance.brackets.length;
    var regCount = 0;
    for(var i = 0; i < bracketLen; i ++) {
      const payments = instance.tickets.fees[i].payments;
      if(payments && payments[userId] != null) {
        regCount ++;
      }
    }
    var unsetObj = {
      [`tickets.fees.${index}.payments.${userId}`]: 1
    };
    if(regCount == 1) {
      unsetObj[`tickets.fees.venue.payments.${userId}`] = 1;
      unsetObj[`tickets.payables.${userId}`] = 1;
    }
    Instances.update(instanceId, {
      $unset: unsetObj
    });
  }
})
