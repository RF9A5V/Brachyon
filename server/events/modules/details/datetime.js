Meteor.methods({
  "events.details.datetimeSave"(id, dateObj) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.")
    }
    Events.update(id, {
      $set: {
        "details.datetime": dateObj
      }
    })
  }
})
