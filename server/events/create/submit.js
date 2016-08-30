// Might have more complex stuff involved with the submission process. Thus, this file.

Meteor.methods({
  "events.submitForReview"(eventID) {
    var event = Events.findOne(eventID);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(eventID, {
      $set: {
        underReview: true
      }
    })
  }
})
