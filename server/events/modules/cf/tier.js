Meteor.methods({
  "events.crowdfunding.createTier"(id, name, price, limit, description, rewards) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $push: {
        "crowdfunding.tiers": {
          $each: [
            {
              name,
              price,
              limit,
              description,
              rewards
            }
          ],
          $sort: {
            price: 1
          }
        }
      }
    })
  },
  "events.crowdfunding.updateTier"(id, index, name, price, limit, description, rewards) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`crowdfunding.tiers.${index}`]: {
          name,
          price,
          limit,
          description,
          rewards
        }
      }
    })
  },
  "events.crowdfunding.deleteTier"(id, index) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $unset: {
        [`crowdfunding.tiers.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        "crowdfunding.tiers": null
      }
    });
  },
  "events.crowdfunding.tiers.updateSponsor"(id, tierIndex, obj) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    if(!Meteor.user()){
      throw new Meteor.Error(403, "Not logged in!");
    }
    var tierSponsors = event.crowdfunding.tiers[tierIndex].sponsors || [];
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
        [`crowdfunding.tiers.${tierIndex}.sponsors`]: {
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
    for(var i = 0; i < event.crowdfunding.tiers.length; i ++){
      if(i != tierIndex){
        cmd["$pull"]["crowdfunding.tiers."+i+".sponsors"] = {
          id: userId
        }
      }
    }
    var sponsors = event.crowdfunding.sponsors;
    index = -1;
    for(var i = 0; i < sponsors.length; i ++){
      if(sponsors[i].id == userId){
        index = i;
        break;
      }
    }
    if(index >= 0){
      cmd["$inc"] = {
        [`crowdfunding.sponsors.${index}.amount`]: obj.baseAmount
      }
    }
    else {
      cmd["$push"] = {
        "crowdfunding.sponsors": {
          amount: obj.baseAmount,
          id: userId
        }
      }
    }
    Events.update(id, cmd);
  },
  "events.crowdfunding.tiers.setShippedForSponsor"(id, index, sponsId) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found!");
    }
    var sponsIndex = -1;
    console.log(event.crowdfunding.tiers[index].sponsors);
    for(var i = 0; i < event.crowdfunding.tiers[index].sponsors.length; i ++){
      if(event.crowdfunding.tiers[index].sponsors[i].id == sponsId){
        sponsIndex = i;
        break;
      }
    }
    if(sponsIndex < 0){
      throw new Meteor.Error(403, "Can't ship to non-existent sponsor.");
    }
    Events.update(id, {
      $set: {
        [`crowdfunding.tiers.${index}.sponsors.${sponsIndex}.shipped`]: true
      }
    })
  }
})
