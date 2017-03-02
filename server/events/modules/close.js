import Instances from "/imports/api/event/instance.js";
import Leagues from "/imports/api/leagues/league.js";
import OrganizeSuite from "/server/tournament_api.js";
import Brackets from "/imports/api/brackets/brackets.js";

Meteor.methods({
  "events.close"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var instance = Instances.findOne(event.instances.pop());
    var brackets = instance.brackets;
    var hasBracketsOutstanding = brackets && brackets.length > 0 && brackets.some(bracket => { return bracket.endedAt == null });
    if(hasBracketsOutstanding) {
      throw new Meteor.Error(403, "Cannot close event with brackets outstanding!");
    }
    Events.update(id, {
      $set: {
        isComplete: true,
        underReview: false,
        published: false
      }
    });
    Instances.update(instance._id, {
      $set: {
        completedAt: new Date()
      }
    })
  }
})
