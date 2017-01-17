import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
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
  "events.brackets.updateMatchScore"(id, bracketNum, round, match, useP1, value) {
    var bracket = Brackets.findOne(id).rounds;
    var scoreField = useP1 ? "scoreOne" : "scoreTwo";
    Brackets.update(id, {
      $inc: {
        [`rounds.${bracketNum}.${round}.${match}.${scoreField}`]: value
      }
    })
  }
})
