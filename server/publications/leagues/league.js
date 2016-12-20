import Games from "/imports/api/games/games.js";

Meteor.publish("league", (slug) => {
  var league = Leagues.findOne({slug});
  return [
    Leagues.find({ slug }),
    Events.find({ slug: { $in: league.events } }),
    Games.find({_id: league.game})
  ]
})
