import Leagues from "/imports/api/leagues/league.js";
import Instances from "/imports/api/event/instance.js"
import { flatten } from "flat";

Meteor.methods({
  "leagues.edit"(id, attrs) {
    var league = Leagues.findOne(id);

    var brackets;
    if(attrs.brackets) {
      brackets = JSON.parse(JSON.stringify(attrs.brackets));
      delete attrs.brackets;
    }

    Leagues.update(id, {
      $set: flatten(attrs)
    });
    if(brackets) {
      Object.keys(brackets).forEach(k => {
        var slug = league.events[k];
        var instanceId = Events.findOne({ slug }).instances.pop();
        var flattened = flatten(brackets[k]);
        var nextAttrs = {};
        Object.keys(flattened).forEach(k => { nextAttrs["brackets.0." + k] = flattened[k] });
        Instances.update(instanceId, {
          $set: nextAttrs
        });
      })
    }
  },
  "leagues.addEvent"(id, date) {
    var league = Leagues.findOne(id);
    var event = Events.findOne({slug: league.events.pop()});
    var obj = {};
    obj.details = league.details;
    obj.details.name = league.details.name.split(" ").slice(0, -1).join(" ") + ` ${league.events.length + 1}`
    obj.details.datetime = date;
    obj.creator = {
      id: league.owner,
      type: "user"
    }
    var brack = Instances.findOne(event.instances.pop()).brackets[0];
    obj.brackets = [{
      format: brack.format,
      game: brack.game,
      name: ""
    }];
    var slug = Meteor.call("events.create", obj, id);
    Leagues.update(id, {
      $push: {
        "events": slug,
        "leaderboard": {}
      }
    });
    return slug;
  },
  "leagues.removeEvent"(id, index) {
    var league = Leagues.findOne(id);
    var event = Events.findOne({slug: league.events[index]});
    if(event) {
      var instance = Instances.findOne(event.instances.pop());
      if(instance.brackets[0].id) {
        throw new Meteor.error(403, "Can't remove already active event!");
      }
      else {
        Instances.remove(instance._id);
        Leagues.update(id, {
          $unset: {
            [`leaderboard.${index}`]: 1
          }
        })
        Leagues.update(id, {
          $pull: {
            "events": event.slug,
            leaderboard: null
          }
        })
        Events.remove(event._id);
      }
    }
  }
})
