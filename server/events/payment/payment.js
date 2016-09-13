Meteor.methods({
  "events.updatePayment"(eventID, price, comment) {
    var event = Events.findOne(eventID);
    var index = -1;
    for(var i = 0; i < event.revenue.tiers.length; i ++) {
      if(event.revenue.tiers[i].price > price) {
        index = i - 1;
        break;
      }
    }
    if(index == -1 && price >= event.revenue.tiers[event.revenue.tiers.length - 1].price){
      index = event.revenue.tiers.length - 1;
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
          ["revenue.tiers." + (index >= 0 ? index : 0) + ".limit"]: index >= 0 ? -1 : 0,
          "revenue.current": parseInt(price),
        },
        $push: {
          "revenue.sponsors": {
            id: Meteor.userId(),
            price: parseInt(price),
            comment: comment
          }
        }
      }, {
        $sort: {
          "revenue.sponsors.price": 1
        }
      })
    }
    else {
      Events.update(eventID, {
        $inc: {
          ["revenue.tiers." + (index >= 0 ? index : 0) + ".limit"]: index >= 0 ? -1 : 0,
          "revenue.current": parseInt(price),
          [`revenue.sponsors.${sponsIndex}.price`]: parseInt(price)
        },
        $set: {
          [`revenue.sponsors.${sponsIndex}.comment`]: comment
        }
      });
    }
  }
})
