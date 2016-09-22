Meteor.methods({
  "events.revenue.savePrize"(id, brackets){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "revenue.prizesplit": brackets,
      }
    })
  }
})
