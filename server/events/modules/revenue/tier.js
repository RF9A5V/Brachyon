Meteor.methods({
  "events.revenue.createTier"(id, name, price, limit, description) {
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
          description
        }
      }
    })
  },
  "events.revenue.updateTier"(id, index, name, price, limit, description) {
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
          description
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
  }
})
