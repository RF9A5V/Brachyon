Meteor.methods({
  "tickets.removePayment"(instanceId, index, userId) {
    var instance = Instances.findOne(instanceId);
    var bracketLen = instance.brackets.length;
    var regCount = 0;
    for(var i = 0; i < bracketLen; i ++) {
      if(instance.tickets[i + ""].payments[userId]) {
        regCount ++;
      }
    }
    var unsetObj = {
      [`tickets.${index}.payments.${userId}`]: 1
    };
    if(regCount == 1) {
      unsetObj[`tickets.venue.payments.${userId}`] = 1
    }
    instance.tickets[index].discounts.forEach((d, i) => {
      unsetObj[`tickets.${index}.discounts.${i}.qualifiers.${userId}`] = 1;
    })
    Instances.update(instanceId, {
      $unset: unsetObj
    });
  }
})
