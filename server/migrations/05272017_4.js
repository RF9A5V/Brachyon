import Instances from "/imports/api/event/instance.js";
import Events from "/imports/api/event/events.js";
import Leagues from "/imports/api/leagues/league.js";
import Games from "/imports/api/games/games.js";

Migrations.add({
  version: 4,
  up: function() {
    const instances = Instances.find({}, {
      fields: {
        _id: 1,
        brackets: 1
      }
    }).fetch();;
    instances.forEach(i => {
      var event;
      var league;
      event = Events.findOne({
        instances: i._id
      }, {
        fields: {
          _id: 1
        }
      });
      var updateObj = {};
      if(event) {
        updateObj.event = event._id;
        league = Leagues.findOne({
          events: {
            id: event._id
          }
        }, {
          fields: {
            _id: 1
          }
        });

        if(league) {
          updateObj["league"] = league._id;
        }
      }
      var count = 0;
      (i.brackets || []).forEach((b, n) => {
        var name;
        if(!b.slug) {
          if(b.name) {
            name = b.name.toLowerCase().replace(/\s/g, "-");
          }
          else if(b.game) {
            name = Games.findOne(b.game).slug;
          }
          else {
            name = i.slug || "brachyon";
          }
          updateObj[`brackets.${n}.slug`] = name;
        }
        if(!b.hash) {
          updateObj[`brackets.${n}.hash`] = Meteor.call("brackets.generateHash", name);
        }
      });
      if(Object.keys(updateObj).length > 0) {
        Instances.update(i._id, {
          $set: updateObj
        });
      }
    })
  }
})
