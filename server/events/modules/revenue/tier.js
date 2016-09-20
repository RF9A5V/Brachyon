Meteor.methods({
  "events.revenue.createTier"(id, name, price, limit, description, rewards) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $push: {
        "revenue.tiers": {
          name,
          price,
          limit,
          description,
          rewards
        }
      }
    })
  },
  "events.revenue.updateTier"(id, index, name, price, limit, description, rewards) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`revenue.tiers.${index}`]: {
          name,
          price,
          limit,
          description,
          rewards
        }
      }
    })
  },
  "events.revenue.deleteTier"(id, index) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $unset: {
        [`revenue.tiers.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        "revenue.tiers": null
      }
    });
  },
  "events.revenue.tiers.updateSponsor"(id, tierIndex, obj) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    if(!Meteor.user()){
      throw new Meteor.Error(403, "Not logged in!");
    }
    var tierSponsors = event.revenue.tiers[tierIndex].sponsors || [];
    var userId = Meteor.userId();
    var index = -1;
    for(var i = 0; i < tierSponsors.length; i ++){
    if(tierSponsors[i].id == userId) {
        index = i;
        break;
      }
    }
    if(index >= 0){
      throw new Meteor.Error(403, "Already bought this tier!");
    }
    var cmd = {
      $push: {
        [`revenue.tiers.${tierIndex}.sponsors`]: {
          id: userId,
          name: obj.name,
          address: obj.address,
          city: obj.city,
          state: obj.state,
          zip: obj.zip
        }
      }
    }
    cmd["$pull"] = {};
    for(var i = 0; i < event.revenue.tiers.length; i ++){
      if(i != tierIndex){
        cmd["$pull"]["revenue.tiers."+i+".sponsors"] = {
          id: userId
        }
      }
    }
    var sponsors = event.revenue.sponsors;
    index = -1;
    for(var i = 0; i < sponsors.length; i ++){
      if(sponsors[i].id == userId){
        index = i;
        break;
      }
    }
    if(index >= 0){
      cmd["$inc"] = {
        [`revenue.sponsors.${index}.amount`]: obj.baseAmount
      }
    }
    else {
      cmd["$push"] = {
        "revenue.sponsors": {
          amount: obj.baseAmount,
          id: userId
        }
      }
    }
    Events.update(id, cmd);
  },
  "events.revenue.tiers.setShippedForSponsor"(id, index, sponsId) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found!");
    }
    var sponsIndex = -1;
    console.log(event.revenue.tiers[index].sponsors);
    for(var i = 0; i < event.revenue.tiers[index].sponsors.length; i ++){
      if(event.revenue.tiers[index].sponsors[i].id == sponsId){
        sponsIndex = i;
        break;
      }
    }
    if(sponsIndex < 0){
      throw new Meteor.Error(403, "Can't ship to non-existent sponsor.");
    }
    Events.update(id, {
      $set: {
        [`revenue.tiers.${index}.sponsors.${sponsIndex}.shipped`]: true
      }
    })
  }
})
