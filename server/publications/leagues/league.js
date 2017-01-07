import Games from "/imports/api/games/games.js";

Meteor.publish("league", (slug) => {
  var league = Leagues.findOne({slug});
  var events = Events.find({ slug: { $in: league.events } });
  var instances = Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } });
  var userIds = league.leaderboard[0].map(obj => { return obj.id });
  return [
    Leagues.find({ slug }),
    Events.find({ slug: { $in: league.events } }),
    Games.find({_id: league.game}),
    instances,
    Meteor.users.find({ _id: { $in: userIds } }, { username: 1, "profile.imageUrl": 1 }),
    Brackets.find({ _id: (league.tiebreaker || {}).id })
  ]
})
