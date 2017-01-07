Meteor.methods({
  "events.checkout"(id, obj) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    var ticketValues = 0;
    var price = 0;
    var cmd = {
      $set: {},
      $push: {}
    };
    if(obj.tickets) {
      var ticketAccess = event.tickets.ticketAccess || {};
      var tickets = new Set(ticketAccess[Meteor.userId()] || []);
      obj.tickets.forEach(tick => {
        ticketValues += event.tickets[tick].price * 100;
        tickets.add(tick);
      });
      cmd["$set"]["tickets.ticketAccess"] = {
        [`${Meteor.userId()}`]: Array.from(tickets)
      }
    }
    if(obj.tierIndex >= 0) {
      price += event.crowdfunding.tiers[obj.tierIndex].price * 100;
      cmd["$push"] = {
        [`crowdfunding.tiers.${obj.tierIndex}.sponsors`]: Meteor.userId()
      }
    }
    if(price + ticketValues != obj.baseAmount) {
      throw new Meteor.Error(403, "Invalid amount found for base price.");
    }
    if(obj.baseAmount > 0){
      Meteor.call("addCard", obj.token, (err) => {
        if(err) {
          throw err;
        }
        var index = -1;
        for(var i in (event.crowdfunding.sponsors || [])) {
          if(event.crowdfunding.sponsors[i].user == Meteor.userId()) {
            index = i;
            break;
          }
        }
        if(index > -1) {
          cmd["$inc"] = {};
          cmd["$inc"][`crowdfunding.sponsors.${index}.amount`] = price;
        }
        else {
          cmd["$push"]["crowdfunding.sponsors"] = {
            id: Meteor.userId(),
            cfAmount: price,
            ticketAmount: ticketValues
          }
        }
        Events.update(id, cmd);
      });
    }
    else if(Object.keys(cmd).length){
      Events.update(id, cmd);
    }
  }
})
