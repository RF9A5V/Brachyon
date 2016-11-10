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
    console.log(id);
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0];
    var scoreField = useP1 ? "scoreOne" : "scoreTwo";
    Instances.update(instance._id, {
      $inc: {
        [`brackets.0.rounds.${bracketNum}.${round}.${match}.${scoreField}`]: value
      }
    })
  }
})
