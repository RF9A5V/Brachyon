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
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var brackets = instance.brackets;
    var hasBracketsOutstanding = brackets && brackets.length > 0 && brackets.some(bracket => { return bracket.endedAt == null });
    if(hasBracketsOutstanding) {
      throw new Meteor.Error(403, "Cannot close event with brackets outstanding!");
    }
    if(event.league) {
      var league = Leagues.findOne(event.league);
      var eventIndex = league.events.indexOf(event.slug);
      if(eventIndex == league.events.length - 1) {
        var ldr = league.leaderboard[0].sort((a, b) => {
          return (b.score + b.bonus) - (a.score + a.bonus);
        });
        var maxScore = ldr[0].score + ldr[0].bonus;
        ldr = ldr.filter(obj => {
          return maxScore == (obj.score + obj.bonus);
        });
        if(ldr.length > 1) {
          var usrs = Meteor.users.find({ _id: { $in: ldr.map(obj => { return obj.id }) } });
          var rounds = OrganizeSuite.roundRobin(usrs.map(function(participant) {
            return participant.username;
          }));
          var br = Brackets.insert({
            rounds: rounds
          });
          Leagues.update(event.league, {
            $set: {
              "tiebreaker": {
                format: "round_robin",
                id: br
              }
            }
          })
        }
        else {
          Leagues.update(event.league, {
            $set: {
              complete: true
            }
          });
        }
      }
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
