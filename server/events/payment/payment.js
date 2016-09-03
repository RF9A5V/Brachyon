Meteor.methods({
  "events.updatePayment"(eventID, amount) {
    var event = Events.findOne(eventID);
    var index = -1;
    for(var i = 0; i < event.revenue.tierRewards.length; i ++) {
      if(event.revenue.tierRewards[i].amount > amount) {
        index = i - 1;
        break;
      }
    }
    if(index == -1 && amount >= event.revenue.tierRewards[event.revenue.tierRewards.length - 1].amount){
      index = event.revenue.tierRewards.length - 1;
    }
    Events.update(eventID, {
      $inc: {
        ["revenue.tierRewards." + (index >= 0 ? index : 0) + ".limit"]: index >= 0 ? -1 : 0,
        "revenue.crowdfunding.current": amount,
        ["revenue.crowdfunding.sponsors." + Meteor.userId()]: amount
      }
    })
  }
})
