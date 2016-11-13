Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $pull: {
        [`brackets.${index}.participants`]: {
          alias
        }
      }
    })
  },
  "events.brackets.startBracket"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
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
