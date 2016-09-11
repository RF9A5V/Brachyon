Meteor.methods({
  "events.revenue.createTicketCost"(id, name, amount, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $push: {
        "revenue.tickets": {
          name,
          amount,
          description
        }
      }
    })
  },
  "events.revenue.updateTicketCost"(id, index, name, amount, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`revenue.tickets.${index}`]: {
          name,
          amount,
          description
        }
      }
    })
  },
  "events.revenue.deleteTicketCost"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $unset: {
        [`revenue.tickets.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        "revenue.tickets": null
      }
    })
  }
})
