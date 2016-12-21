import Leagues from "/imports/api/leagues/league.js";

Meteor.methods({
  "leagues.create"(attrs) {
    var events = attrs.events;
    var bracket = {
      game: attrs.brackets.gameObj._id,
      format: attrs.brackets.format
    };
    attrs.leaderboard = [];
    attrs.owner = Meteor.userId();
    attrs.game = attrs.brackets.gameObj._id;
    delete attrs.brackets.gameObj;
    var league = Leagues.insert(attrs);
    var eventSlugs = [];
    events.forEach((e) => {
      var createObj = {};
      createObj.details = attrs.details;
      createObj.details.name = e.name;
      createObj.details.datetime = e.date;
      createObj.brackets = [bracket];
      eventSlugs.push(Meteor.call("events.create", createObj, league));
    });
    Leagues.update({ _id: league }, { $set: { "events": eventSlugs } });
    return Leagues.findOne(league).slug;
  }
})
