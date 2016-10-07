Meteor.methods({
  "events.brackets.create"(id, subName) {
    Events.update(id, {
      $set: {
        brackets: []
      }
    })
  },
  "events.brackets.delete"(id, subName) {
    var event = Events.findOne(id);
    var cmd = {
      $unset: {
        brackets: ""
      }
    };
    if(event.tickets) {
      for(var i = 0; i < event.brackets.length; i ++){
        cmd["$unset"]["tickets." + i + "f"] = 1;
      }
    }
    Events.update(id, cmd);
  }
})
