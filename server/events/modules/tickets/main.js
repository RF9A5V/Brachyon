import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.tickets.create"(id, subName) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var cmd = {
      $set: {
        "tickets": {
          venue: {
            price: 0,
            description: ""
          },
          spectator: {
            price: 0,
            description: ""
          }
        }
      }
    };
    if(instance.brackets) {
      instance.brackets.forEach((bracket, index) => {
        cmd["$set"]["tickets"][`${index}`] = {
          price: 0,
          description: ""
        }
      });
    }
    Instances.update(instance._id, cmd);
  },

  "events.tickets.delete"(id) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    Instances.update(instance._id, {
      $unset: {
        tickets: ""
      }
    })
  }
})
