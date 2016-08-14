var validateFields = (tierObj) => {

  if(tierObj.name !== undefined) {
    if(tierObj.name == null || tierObj.name == "") {
      throw  new Meteor.Error(403, "Name cannot be blank.");
    }
  }

  if(isNaN(tierObj.amount)) {
    throw new Meteor.Error(403, "Amount must be numeric.");
  }
  else {
    tierObj.amount *= 100;
  }
  if(!tierObj.description) {
    throw new Meteor.Error(403, "Description can't be blank.");
  }
  if(isNaN(tierObj.limit)) {
    throw new Meteor.Error(403, "Limit must be numeric.");
  }
  return tierObj;
}

Meteor.methods({
  "events.createTier"(eventID, tierObj) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    tierObj = validateFields(tierObj);
    if(typeof(event.revenue.tierRewards) == "boolean") {
      Events.update(eventID, {
        $set: {
          "revenue.tierRewards": [tierObj]
        }
      })
    }
    else {
      Events.update(eventID, {
        $push: {
          "revenue.tierRewards": tierObj
        }
      });
    }
  },
  "events.editTier"(eventID, tierIndex, tierObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.tierRewards || typeof(event.revenue.tierRewards) == "boolean" || event.revenue.tierRewards.length <= tierIndex) {
      throw new Meteor.Error(404, "Tier not found.");
    }
    tierObj = validateFields(tierObj);
    Events.update(eventID, {
      $set: {
        [`revenue.tierRewards.${tierIndex}`]: tierObj
      }
    });
  },
  "events.deleteTier"(eventID, tierIndex) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.tierRewards || typeof(event.revenue.tierRewards) == "boolean" || event.revenue.tierRewards.length <= tierIndex) {
      throw new Meteor.Error(404, "Tier not found.");
    }
    var tiers = event.revenue.tierRewards;
    tiers.splice(tierIndex, 1);
    console.log(tiers);
    Events.update(eventID, {
      $set: {
        [`revenue.tierRewards`]: tiers
      }
    });
  },
  "events.createTicket"(eventID, ticketObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue) {
      throw new Meteor.Error(404, "Revenue module is not set up for this event.");
    }
    ticketObj = validateFields(ticketObj);
    if(typeof(event.revenue.ticketing) == "boolean") {
      Events.update(eventID, {
        $set: {
          "revenue.ticketing": [ticketObj]
        }
      })
    }
    else {
      Events.update(eventID, {
        $push: {
          "revenue.ticketing": ticketObj
        }
      })
    }
  },
  "events.editTicket"(eventID, index, ticketObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue) {
      throw new Meteor.Error(404, "Revenue module is not set up for this event.");
    }
    if(!event.revenue.ticketing || typeof(event.revenue.ticketing) == "boolean") {
      throw new Meteor.Error(404, "Ticket not found.");
    }
    ticketObj = validateFields(ticketObj);
    Events.update(eventID, {
      $set: {
        [`revenue.ticketing.${index}`]: ticketObj
      }
    })
  },
  "events.deleteTicket"(eventID, index) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue) {
      throw new Meteor.Error(404, "Revenue module is not set up for this event.");
    }
    if(!event.revenue.ticketing || typeof(event.revenue.ticketing) == "boolean" || event.revenue.ticketing.length <= index) {
      throw new Meteor.Error(404, "Ticket not found.");
    }
    var tickets = event.revenue.ticketing;
    tickets.splice(index, 1);
    Events.update(eventID, {
      $set: {
        "revenue.ticketing": tickets
      }
    });
  }
})
