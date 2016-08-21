Meteor.methods({
  "events.updatePaymentValues"(userID, eventID, breakdown, amount) {
    var user = Meteor.users.findOne(userID);
    if(!user){
      throw new Meteor.Error(404, "User not found.");
    }
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    var updateObj = {};
    for(var i = 0; i < breakdown.length; i ++){
      if(breakdown[i].hasOwnProperty("poolID")) {
        updateObj[`organize.${breakdown[i].poolID}.prizePool`] = breakdown[i].percentage * amount;
      }
      else if(breakdown[i].hasOwnProperty("index")) {
        updateObj[`revenue.stretchGoals.${breakdown[i].index}.current`] = breakdown[i].percentage * amount;
      }
    }
    Events.update(eventID, {
      $inc: updateObj,
      $set: {
        [`sponsors.${userID}`]: 1
      }
    });
  }
})
