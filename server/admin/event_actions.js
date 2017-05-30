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
  },
  "events.setBrachyonPromoted"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    if(event.crowdfunding) {
      throw new Meteor.Error(400, "Event already has CF");
    }
    Events.update(id, {
      $set: {
        crowdfunding: {
          users: []
        }
      }
    });
  }
})
