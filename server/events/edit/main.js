import { flatten } from "flat";

Meteor.methods({
  "events.edit"(id, attrs) {
    var event = Events.findOne(id);

    if(attrs.stream == "" || attrs.stream == null) {
      delete attrs.stream;
    }
    else {
      attrs.stream = {
        twitchStream: {
          name: attrs.stream
        }
      };
    }

    updateObj = flatten(attrs);
    Events.update(id, {
      $set: updateObj
    });
  }
})
