Meteor.methods({
  "events.updatePayment"(eventID, amount, comment) {
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

    var sponsIndex = null;
    var sponsors = event.revenue.crowdfunding.sponsors;
    for(var i in sponsors) {
      if(sponsors[i].id == Meteor.userId()){
        sponsIndex = i;
        break;
      }
    }

    if(sponsIndex === null) {
      Events.update(eventID, {
        $inc: {
          ["revenue.tierRewards." + (index >= 0 ? index : 0) + ".limit"]: index >= 0 ? -1 : 0,
          "revenue.crowdfunding.current": parseInt(amount),
        },
        $push: {
          "revenue.crowdfunding.sponsors": {
            id: Meteor.userId(),
            amount: parseInt(amount),
            comment: comment
          }
        }
      }, {
        $sort: {
          "revenue.crowdfunding.sponsors.amount": 1
        }
      })
    }
    else {
      Events.update(eventID, {
        $inc: {
          ["revenue.tierRewards." + (index >= 0 ? index : 0) + ".limit"]: index >= 0 ? -1 : 0,
          "revenue.crowdfunding.current": parseInt(amount),
          [`revenue.crowdfunding.sponsors.${sponsIndex}.amount`]: parseInt(amount)
        },
        $set: {
          [`revenue.crowdfunding.sponsors.${sponsIndex}.comment`]: comment
        }
      });
    }
  }
})
