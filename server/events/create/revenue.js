import moment from "moment";

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
          "revenue.tierRewards": {
            $each: [tierObj],
            $sort: {
              amount: 1
            }
          }
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
          "revenue.ticketing": {
            $each: [ticketObj],
            $sort: {
              amount: 1
            }
          }
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

  "events.addGoal"(eventID, parentIndex, goalObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.strategy.goals) {
      throw new Meteor.Error(403, "Stretch goals for this event have not been set up.");
    }
    goalObj.children = [];
    var goalObj = validateFields(goalObj);
    var objCount = event.revenue.strategy.goals.length;
    Events.update(eventID, {
      $push: {
        [`revenue.strategy.goals`]: goalObj
      }
    });
    if(objCount != 0) {
      Events.update(eventID, {
        $push: {
          [`revenue.strategy.goals.${parentIndex}.children`]: objCount
        }
      });
    }
  },

  "events.editGoal"(eventID, goalIndex, goalObj) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.strategy.goals) {
      throw new Meteor.Error(403, "Stretch goals are not enabled for this event.");
    }
    if(!event.revenue.strategy.goals[goalIndex]){
      throw new Meteor.Error(404, "Goal for event was not found.");
    }
    var children = event.revenue.strategy.goals[goalIndex].children;
    goalObj.children = children;
    Events.update(eventID, {
      $set: {
        [`revenue.strategy.goals.${goalIndex}`]: goalObj
      }
    });
  },

  "events.removeGoal"(eventID, goalIndex) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(!event.revenue || !event.revenue.strategy.goals) {
      throw new Meteor.Error(403, "Stretch goals are not enabled for this event.");
    }
    if(!event.revenue.strategy.goals[goalIndex]){
      throw new Meteor.Error(404, "Goal for event was not found.");
    }
    if(goalIndex == 0) {
      throw new Meteor.Error(403, "Can't remove your base goal.");
    }
    var goals = event.revenue.strategy.goals;
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
        [`revenue.strategy.goals.${index}`]: parent
      },
      $unset: {
        [`revenue.strategy.goals.${goalIndex}`]: 1
      }
    });
  },

  "events.savePrizePool"(eventID, prizePool) {
    Events.update(eventID, {
      $set: {
        "revenue.prizePool": prizePool
      }
    })
  },

  "events.setSkillPointThreshold"(eventID, amount) {
    Events.update(eventID, {
      $set: {
        "revenue.strategy.pointThreshold": amount
      }
    })
  },

  "events.saveCFDetails"(eventID, dateString, amount) {
    Events.update(eventID,{
      $set: {
        "revenue.crowdfunding.dueDate": moment(dateString).toDate(),
        "revenue.crowdfunding.amount": amount * 100
      }
    })
  }

})
