import Instances from "/imports/api/event/instance.js";
import Leagues from "/imports/api/leagues/league.js";
import OrganizeSuite from "/imports/decorators/organize.js";
import Brackets from "/imports/api/brackets/brackets.js";

Meteor.methods({
  "events.close"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var instance = Instances.findOne(event.instances.pop());
    var brackets = instance.brackets;

    var instanceGone = false;
    var eventGone = false;

    if(brackets) {
      const unfinishedBrackets = brackets.filter(b => {
        return !b.isComplete;
      });
      Brackets.remove({
        _id: {
          $in: unfinishedBrackets.map(b => { return b.id })
        }
      });
    }
    if(!eventGone) {
      Events.update(id, {
        $set: {
          isComplete: true,
          underReview: false,
          published: false
        }
      });
    }
    if(!instanceGone) {
      Instances.update(instance._id, {
        $set: {
          completedAt: new Date()
        }
      })
    }
  }
})
