Meteor.methods({
  "events.details.imageSave"(id, bannerId){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "details.banner": bannerId
      }
    })
  }
})
