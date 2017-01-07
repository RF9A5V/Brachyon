import Leagues from "/imports/api/leagues/league.js";

Meteor.publish("userLeagues", (id) => {
  return Leagues.find({ owner: id });
})
