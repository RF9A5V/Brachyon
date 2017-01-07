import Leagues from "/imports/api/leagues/league.js";
import Instances from "/imports/api/event/instance.js"
import { flatten } from "flat";

Meteor.methods({
  "leagues.edit"(slug, changelog) {
    var attrs = {};
    var league = Leagues.findOne({slug});
    if(changelog.league) {
      var attrs = flatten(changelog.league);
      if(attrs["details.image"]) {
        delete attrs["details.image"];
      }
      //attrs.slug = ((changelog.league.details || {}).name || league.details.name).replace(/\W/g, "") + "." + ((changelog.league.details || {}).season || league.details.season);
      Leagues.update({slug}, {
        $set: attrs
      });
      var dets = changelog.league.details || {}
      if(dets.name || dets.season) {
        var eSlugs = league.events.map((eSlug, i) => {
          var season = dets.season || league.details.season;
          var name = dets.name || league.details.name;
          var event = Events.findOne({ slug: eSlug });
          Events.update({ slug: eSlug }, {
            $set: {
              "details.name": name + "." + season + " " + (i + 1)
            }
          });
          event = Events.findOne(event._id);
          return event.slug;
        });
        Leagues.update(league._id, {
          $set: {
            events: eSlugs
          }
        });
      }

    }
    if(changelog.events) {
      Object.keys(changelog.events).forEach((key, i) => {
        Events.update({ slug: key }, {
          "$set": changelog.events[key].date
        });
      });
      var setObj = {};
      if(changelog.league.game) {
        setObj["game"] = changelog.league.game;
      }
      if(changelog.brackets) {
        setObj["brackets.0"] = changelog.league.brackets;
      }
      if(Object.keys(setObj).length > 0) {
        var instances = Events.find({ slug: { $in: Object.keys(changelog.events) } }).map(e => { return e.instances.pop() });
        Instances.update({ _id: { $in: instances } }, {
          $set: flatten(setObj)
        })
      }
    }
    return Leagues.findOne(league._id).slug;
  }
})
