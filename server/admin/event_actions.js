Meteor.methods({
  "events.approveEventForPublish"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    Events.update(id, {
      $set: {
        published: true,
        underReview: false
      }
    })
  },
  "events.rejectEventForPublish"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    Events.update(id, {
      $set: {
        published: false,
        underReview: false
      }
    })
  }
})
