import Games from "/imports/api/games/games.js";

Meteor.publish("league", (slug) => {
  var league = Leagues.findOne({slug});
  var events = Events.find({ slug: { $in: league.events } });
  var instances = Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } });
  var ids = {};
  league.leaderboard.forEach(board => {
    Object.keys(board).forEach(id => {
      ids[id] = 1;
    })
  });
  ids[league.owner] = 1;
  var bIds = instances.map(i => {
    return i.brackets[0].id;
  });
  bIds.push(league.tiebreaker);
  var brackets = Brackets.find({
    _id: {
      $in: bIds
    }
  });
  var matches = [];
  brackets.forEach(b => {
    b.rounds.forEach(i => {
      if(i.forEach) {
        i.forEach(j => {
          j.forEach(k => {
            if(k) {
              matches.push(k.id);
            }
          })
        })
      }
    })
  });
  return [
    Leagues.find({ slug }),
    Events.find({ slug: { $in: league.events } }),
    Games.find({_id: league.game}),
    instances,
    Meteor.users.find({ _id: { $in: Object.keys(ids) } }, { username: 1, "profile.imageUrl": 1 }),
    Brackets.find({ _id: { $in: bIds } }),
    Matches.find({ _id: { $in: matches } })
  ]
});

Meteor.publish("leagueByID", (id) => {
  var league = Leagues.findOne(id);
  var ids = {};
  league.leaderboard.forEach(board => {
    Object.keys(board).forEach(id => {
      ids[id] = 1;
    })
  });
  return [
    Leagues.find({ _id: id }),
    Meteor.users.find({ _id: { $in: Object.keys(ids) } })
  ];
})

Meteor.methods({
  "leaguePromotionValue": (_id, value) => {
    Leagues.update(_id, {
      $set: {
        "promotion.bid": value
      }
    })
  },
  "leaguePromotionActive": (_id, active) => {
    Leagues.update(_id, {
      $set: {
        "promotion.active": active
      }
    })
  }
})
