Meteor.methods({
  "events.promotion.setFeatured"(id, featured) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "promotion.featured": featured
      }
    })
  }
})
