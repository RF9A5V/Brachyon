Meteor.methods({
  "events.crowdfunding.savePrize"(id, brackets){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "crowdfunding.prizesplit": brackets,
      }
    })
  }
})
