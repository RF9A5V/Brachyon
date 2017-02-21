import { flatten } from "flat";

Meteor.methods({
  "events.edit"(id, attrs) {
    var event = Events.findOne(id);
    updateObj = flatten(attrs);
    Events.update(id, {
      $set: updateObj
    });
  }
})
