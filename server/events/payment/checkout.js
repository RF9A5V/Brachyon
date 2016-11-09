import Instance from "/imports/api/event/instance.js";

Meteor.methods({
  "events.checkout"(slug, obj) {
    var event = Events.findOne({ slug });
    var instance = Instances.findOne(event.instances.pop());
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    var ticketValues = 0;
    var price = 0;
    var cmd = {
      $set: {}
    };
    if(obj.tickets) {
      var ticketAccess = instance.access || {};
      var tickets = new Set(ticketAccess[Meteor.userId()] || []);
      obj.tickets.forEach(tick => {
        ticketValues += instance.tickets[tick];
        tickets.add(tick);
      });
      cmd["$set"]["access"] = {
        [`${Meteor.userId()}`]: Array.from(tickets)
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
        if(price == 0 && ticketValues > 0) {
          Meteor.call("chargeCard", event.owner, obj.amount, obj.token, (err) => {
            if(err) {
              throw new Meteor.Error(500, err.reason);
            }
            else {
              Instances.update(instance._id, cmd);
            }
          })
        }
      });
    }
    else if(Object.keys(cmd).length){
      Instances.update(instance._id, cmd);
    }
  }
})
