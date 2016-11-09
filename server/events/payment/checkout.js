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
          Meteor.call("chargeCard", event.owner, obj.amount, obj.token, obj.amount - obj.baseAmount, (err) => {
            if(err) {
              throw new Meteor.Error(500, err.reason);
            }
            else {
              var bracketCmd = {};
              var hasBrackets = false;
              var user = Meteor.users.findOne(Meteor.userId());
              tickets.forEach(tick => {
                var match = tick.match(/[0-9]+/);
                if(match) {
                  bracketCmd[`brackets.${match}.participants`] = {
                    id: Meteor.userId(),
                    alias: user.username
                  };
                }
              })
              if(Object.keys(bracketCmd).length > 0) {
                cmd["$push"] = bracketCmd;
              }
              Instances.update(instance._id, cmd);
            }
          })
        }
      });
    }
    else if(Object.keys(cmd).length){
      Instances.update(instance._id, cmd);
    }
  },
  "events.issueTickets"(instanceID, tickets) {
    var instance = Instances.findOne(instanceID);
    var ticketList = new Set(((instance.access || {})[Meteor.userId()] || []).concat(tickets));
    var cmd = {};
    var user = Meteor.users.findOne(Meteor.userId());
    ticketList.forEach(ticket => {
      var match = ticket.match(/[0-9]+/);
      if(match) {
        cmd[`brackets.${match}.participants`] = {
          id: Meteor.userId(),
          alias: user.username
        }
      }
    });
    Instances.update(instanceID, {
      $set: {
        [`access.${Meteor.userId()}`]: Array.from(ticketList)
      },
      $push: cmd
    })
  }
})
