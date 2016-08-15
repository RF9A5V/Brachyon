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
  if(tierObj.limit != null && isNaN(tierObj.limit)) {
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
  },

  "events.addGoal"(eventID, parentIndex, goalObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.stretchGoals) {
      throw new Meteor.Error(403, "Stretch goals for this event have not been set up.");
    }
    goalObj.children = [];
    if(typeof(event.revenue.stretchGoals) == "boolean" || Object.keys(event.revenue.stretchGoals).length == 0) {
      Events.update(eventID, {
        $push: {
          "revenue.stretchGoals": goalObj
        }
      })
    }
    else {
      if(!event.revenue.stretchGoals[parentIndex]){
        throw new Meteor.Error(404, "Parent goal not found.");
      }
      var goalObj = validateFields(goalObj);
      var objCount = event.revenue.stretchGoals.length;
      Events.update(eventID, {
        $push: {
          [`revenue.stretchGoals`]: goalObj
        }
      });
      Events.update(eventID, {
        $push: {
          [`revenue.stretchGoals.${parentIndex}.children`]: objCount
        }
      });
    }
  },

  "events.editGoal"(eventID, goalIndex, goalObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.stretchGoals) {
      throw new Meteor.Error(403, "Stretch goals are not enabled for this event.");
    }
    if(!event.revenue.stretchGoals[goalIndex]){
      throw new Meteor.Error(404, "Goal for event was not found.");
    }
    var children = event.revenue.stretchGoals[goalIndex].children;
    goalObj.children = children;
    Events.update(eventID, {
      $set: {
        [`revenue.stretchGoals.${goalIndex}`]: goalObj
      }
    });
  },

  "events.removeGoal"(eventID, goalIndex) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.stretchGoals) {
      throw new Meteor.Error(403, "Stretch goals are not enabled for this event.");
    }
    if(!event.revenue.stretchGoals[goalIndex]){
      throw new Meteor.Error(404, "Goal for event was not found.");
    }
    if(goalIndex == 0) {
      throw new Meteor.Error(403, "Can't remove your base goal.");
    }
    var goals = event.revenue.stretchGoals;
    var child = goals[goalIndex].children[0];
    var parent = null;
    var index = -1;
    for(var i = 0; i < goalIndex; i ++) {
      if(goals[i].children.indexOf(goalIndex) >= 0) {
        index = i;
        parent = goals[i];
        break;
      }
    }
    if(!parent) {
      throw new Meteor.Error(404, "Couldn't find parent node for deletable node.");
    }
    var childIndex = parent.children.indexOf(goalIndex);
    if(child){
      parent.children[childIndex] = child;
    }
    else {
      parent.children.pop();
    }

    Events.update(eventID, {
      $set: {
        [`revenue.stretchGoals.${index}`]: parent
      },
      $unset: {
        [`revenue.stretchGoals.${goalIndex}`]: 1
      }
    });
  }

})
