Meteor.methods({
  "events.close"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var brackets = event.brackets;
    var hasBracketsOutstanding = brackets && brackets.length > 0 && brackets.some(bracket => { return !bracket.isComplete });
    if(hasBracketsOutstanding) {
      throw new Meteor.Error(403, "Cannot close event with brackets outstanding!");
    }
    Events.update(id, {
      $set: {
        isComplete: true,
        underReview: false,
        published: false
      }
    })
  }
})
