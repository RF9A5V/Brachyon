Meteor.methods({
  "events.createModule"(id, modName, subName) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Meteor.call(`events.${modName}.create`, id, subName);
  },
  "events.deleteModule"(id, modName, subName) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Meteor.call(`events.${modName}.delete`, id, subName);
  }
})
