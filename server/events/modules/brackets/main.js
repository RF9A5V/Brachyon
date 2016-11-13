import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.brackets.create"(id, subName) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    Instances.update(instance._id, {
      $set: {
        brackets: []
      }
    })
  },
  "events.brackets.delete"(id, subName) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var cmd = {
      $unset: {
        brackets: ""
      }
    };
    if(instance.tickets) {
      for(var i = 0; i < instance.brackets.length; i ++){
        cmd["$unset"]["tickets." + i] = 1;
      }
    }
    Instances.update(instance._id, cmd);
  }
})
