Meteor.methods({
  "events.organize.createStaff"(id) {
    var event = Events.findOne(id);
    if(event == null){
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    Events.update(id, {
      $set: {
        "organize.staff": []
      }
    })
  },
  "events.organize.saveStaff"(id, staff) {
    var event = Events.findOne(id);
    if(event == null) {
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(!Array.isArray(staff)){
      throw new Meteor.Error(403, "Can't work with non array staff object.");
    }
    Events.update(id, {
      $set: {
        "organize.staff": staff
      }
    })
  }
})
