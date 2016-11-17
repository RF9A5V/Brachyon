import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.close"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var brackets = instance.brackets;
    var hasBracketsOutstanding = brackets && brackets.length > 0 && brackets.some(bracket => { return bracket.endedAt == null });
    if(hasBracketsOutstanding) {
      throw new Meteor.Error(403, "Cannot close event with brackets outstanding!");
    }
    Events.update(id, {
      $set: {
        isComplete: true,
        underReview: false,
        published: false
      }
    });
    Instances.update(instance._id, {
      $set: {
        completedAt: new Date()
      }
    })
  }
})
