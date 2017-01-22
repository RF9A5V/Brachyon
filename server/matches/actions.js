import Matches from "/imports/api/event/matches.js";

Meteor.methods({
  "match.start"(id) {
    Matches.update(id, {
      $set: {
        startedAt: new Date()
      }
    })
  },
  "match.end"(id) {
    Matches.update(id, {
      $set: {
        endedAt: new Date()
      }
    });
  }
})
