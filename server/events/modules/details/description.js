Meteor.methods({
  "events.details.saveDescription"(id, name, description) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "details.name": name,
        "details.description": description
      }
    })
  }
})
