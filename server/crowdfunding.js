Meteor.methods({
  "events.sponsor"(id, breakdown) {
    var event = Events.findOne(id);
    var user = Meteor.users.findOne(Meteor.userId());
    if(!event){
      throw new Meteor.Error(404, "Event not found!");
    }

    var amt = 0;
    for(var key in breakdown){
      amt += breakdown[key];
    }
    if((user.profile.amount || 0) < amt) {
      throw new Meteor.Error(403, "You lack the required funds to sponsor this event.");
    }

    var obj = {
      [`sponsors.${Meteor.userId()}`]: amt
    }
    for(var key in breakdown) {
      if(key == "main") {
        obj[`revenue.goals.current`] = breakdown[key];
      }
      else {
        [branch, node] = key.split(",");
        obj[`revenue.goals.children.${branch}.nodes.${node}.current`] = breakdown[key];
      }
    }

    Events.update(id, {
      $inc: obj
    });
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.amount": -amt
      }
    })
  }
})
