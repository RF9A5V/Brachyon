import { flatten } from "flat";

Meteor.methods({
  "events.edit"(id, attrs) {
    var event = Events.findOne(id);

    if(attrs.stream == "" || attrs.stream == null) {
      delete attrs.stream;
    }
    else {
      attrs.stream = {
        twitchStream: attrs.stream
      };
    }

    if(attrs.tickets) {
      var updateObj = {};
      Object.keys(attrs.tickets).forEach(k => {
        if(k == "payables" || k == "paymentType") {
          return;
        }
        if(k == "venue") {
          updateObj["tickets.venue.price"] = attrs.tickets[k];
          return;
        }
        var tick = attrs.tickets[k];
        updateObj["tickets." + k + ".price"] = tick.price;
        updateObj["tickets." + k + ".discounts"] = tick.discounts;
      });
      Instances.update(event.instances[event.instances.length - 1], {
        $set: updateObj
      });
    }
    delete attrs.tickets;

    updateObj = flatten(attrs);
    Events.update(id, {
      $set: updateObj
    });
  }
})
