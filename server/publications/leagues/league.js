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
  return [
    Leagues.find({ slug }),
    Events.find({ slug: { $in: league.events } }),
    Games.find({_id: league.game}),
    instances,
    Meteor.users.find({ _id: { $in: Object.keys(ids) } }, { username: 1, "profile.imageUrl": 1 }),
    Brackets.find({ _id: (league.tiebreaker || {}).id })
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
