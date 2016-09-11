Meteor.methods({
  "events.submit"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(event.revenue) {
      Events.update(id, {
        $set: {
          underReview: true
        }
      })
    }
    else {
      Events.update(id, {
        $set: {
          published: true
        }
      })
    }
  }
})
