import Leagues from "/imports/api/leagues/league.js";
import Instances from "/imports/api/events/instance.s"
import { flatten } from "flat";

Meteor.methods({
  "leagues.edit"(slug, changelog) {
    console.log(changelog);
    var attrs = {};
    if(changelog.league) {
      var attrs = flatten(changelog.league);
      Leagues.update({slug}, {
        $set: attrs
      });
    }
    if(changelog.events) {
      Object.keys(changelog.events).forEach((key) => {
        Events.update({ slug: key }, {
          "$set": {
            "details.datetime": changelog.events[key].date
          }
        });
      });
      var setObj = {};
      if(changelog.game) {
        setObj["game"] = changelog.game;
      }
      if(changelog.brackets) {
        setObj["brackets.0"] = changelog.brackets;
      }
      if(Object.keys(setObj).length > 0) {
        var instances = Events.find({ slug: { $in: Object.keys(changelog.events) } }).map(e => { return e.instances.pop() });
        Instances.update({ _id: { $in: instances } }, {
          $set: flatten(setObj)
        })
      }
    }
  }
})
