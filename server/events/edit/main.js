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

    if(attrs.brackets) {
      const instance = Instances.findOne(event.instances[event.instances.length - 1]);
      const bracketCount = (instance.brackets || []).length;
      var updateObj = {};
      var pushObj = [];
      attrs.brackets.forEach((b, i) => {
        if(i >= bracketCount) {
          pushObj.push(b);
        }
        else {
          updateObj[`brackets.${i}.name`] = b.name;
          updateObj[`brackets.${i}.game`] = b.game;
          updateObj[`brackets.${i}.format`] = b.format;
        }
      });
      var query = {};
      if(Object.keys(updateObj).length > 0) {
        Instances.update(instance._id, {
          $set: updateObj
        });
      }
      if(pushObj.length > 0) {
        Instances.update(instance._id, {
          $push: {
            brackets: {
              $each: pushObj
            }
          }
        });
      }
    }
    delete attrs.brackets;

    updateObj = flatten(attrs);
    Events.update(id, {
      $set: updateObj
    });
  }
})
