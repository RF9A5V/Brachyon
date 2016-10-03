Meteor.methods({
  "events.submit"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(event.crowdfunding) {
      Events.update(id, {
        $set: {
          underReview: true,
          published: false
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
