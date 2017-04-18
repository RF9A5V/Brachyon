import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";

Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var instance = Instances.findOne(id);
    if(!instance) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var event = Events.findOne({instances: id});
    var user = Meteor.users.findOne({username: alias});
    if(event.league) {
      var league = Leagues.findOne(event.league);
      var eventIndex = league.events.indexOf(event.slug);
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
      // $unset: {
      //   [`tickets.payables.${user._id}`]: 1
      // }
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
  },
  "events.brackets.setAlias"(instanceId, bracketIndex, oldAlias, alias) {
    const instance = Instances.findOne(instanceId);
    const bracket = instance.brackets[bracketIndex];
    const conflict = bracket.participants.findIndex(p => {
      return p.alias == alias;
    });
    if(conflict >= 0) {
      throw new Meteor.Error(404, "Alias is already taken, pick another.");
    }
    const participantIndex = bracket.participants.findIndex(p => {
      return p.alias == oldAlias;
    });
    Instances.update(instanceId, {
      $set: {
        [`brackets.${bracketIndex}.participants.${participantIndex}.alias`]: alias
      }
    })
  }
})
