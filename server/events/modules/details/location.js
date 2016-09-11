Meteor.methods({
  "events.details.saveLocation"(id, locObj) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "details.location": locObj
      }
    })
  }
})
