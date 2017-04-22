import Leagues from "/imports/api/leagues/league.js";

Migrations.add({
  version: 2,
  up: function() {
    var leagues = Leagues.find();
    leagues.forEach(l => {
      const firstEvent = Events.findOne(l.events[0].id);
      Leagues.update(l._id, {
        $set: {
          "details.datetime": firstEvent.details.datetime
        }
      });
    })
  }
})
