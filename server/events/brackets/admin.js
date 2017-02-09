import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";

Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var instance = Instances.findOne(id);
    if(!instance) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var event = Events.findOne({instances: id});
    if(event.league) {
      var league = Leagues.findOne(event.league);
      var eventIndex = league.events.indexOf(event.slug);
      var user = Meteor.users.findOne({username: alias});
      Leagues.update(event.league, {
        $unset: {
          [`leaderboard.${eventIndex}.${user._id}`]: 1
        }
      });
    }
    Instances.update(instance._id, {
      $pull: {
        [`brackets.${index}.participants`]: {
          alias
        }
      }
    })
  },
  "brackets.removeParticipant"(id, alias) {
    Instances.update(id, {
      $pull: {
        [`brackets.0.participants`]: {
          alias
        }
      }
    })
  },
  "events.brackets.startBracket"(id, index) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.inProgress`]: true
      }
    })
  },
  "events.brackets.updateMatchScore"(id, useP1, value) {
    var scoreField = useP1 ? 0 : 1;
    Matches.update(id, {
      $inc: {
        [`players.${scoreField}.score`]: value
      }
    });
  }
})
