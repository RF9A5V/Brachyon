Meteor.methods({
  "events.crowdfunding.sponsor"(id, value) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    if(isNaN(value) || value == 0) {
      throw new Meteor.Error(403, "Can't update with value!");
    }
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "You need to be logged in to sponsor an event!");
    }
    var sponsors = event.crowdfunding.sponsors || [];
    var sponsIndex = -1;
    var userID = Meteor.userId();
    for(var i in sponsors) {
      if(sponsors[i].id == userID) {
        sponsIndex = i;
        break;
      }
    }
    var newTotal = value;
    if(sponsIndex >= 0) {
      newTotal += sponsors[sponsIndex].cfAmount || 0;
    }
    var tiers = event.crowdfunding.tiers;
    var tierIndex = tiers.length - 1;
    for(var i in tiers) {
      if(tiers[i].price > newTotal) {
        tierIndex = i - 1;
        break;
      }
    }
    var removeCmd = {
      $pull: {}
    };
    for(var i in tiers){
      removeCmd["$pull"][`crowdfunding.tiers.${i}.sponsors`] = userID
    }
    Events.update(id, removeCmd);
    var cmd = {};
    cmd["$push"] = {};
    if(tierIndex >= 0) {
      cmd["$push"][`crowdfunding.tiers.${tierIndex}.sponsors`] = userID;
    }
    cmd["$inc"] = {};
    cmd["$inc"]["crowdfunding.details.current"] = value;
    if(sponsIndex >= 0) {
      cmd["$inc"][`crowdfunding.sponsors.${sponsIndex}.cfAmount`] = value;
    }
    else {
      cmd["$push"][`crowdfunding.sponsors`] = {
        id: userID,
        cfAmount: value,
        ticketAmount: 0
      }
    }
    if(Object.keys(cmd["$push"]).length == 0) {
      delete cmd["$push"];
    }
    if(Object.keys(cmd).length > 0) {
      Events.update(id, cmd);
    }
  }
})
