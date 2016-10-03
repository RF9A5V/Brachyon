Meteor.methods({
  "events.tickets.create"(id, subName) {
    var event = Events.findOne(id);
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
    if(event.brackets) {
      event.brackets.forEach((bracket, index) => {
        cmd["$set"]["tickets"][index + "f"] = {
          price: 0,
          description: ""
        }
      });
    }
    Events.update(id, cmd);
  },

  "events.tickets.delete"(id) {
    Events.update(id, {
      $unset: {
        tickets: ""
      }
    })
  }
})
