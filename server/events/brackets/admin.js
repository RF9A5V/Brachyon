Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $pull: {
        [`brackets.${index}.participants`]: {
          alias
        }
      }
    })
  },
  "events.brackets.startBracket"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`brackets.${index}.inProgress`]: true
      }
    })
  }
})
