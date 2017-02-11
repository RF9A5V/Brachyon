import Leagues from "/imports/api/leagues/league.js";

Meteor.methods({
  "leagues.create"(attrs) {
    var events = attrs.events;
    var bracket = {
      game: attrs.brackets.gameObj._id,
      format: attrs.brackets.format,
      name: attrs.brackets.name || ""
    };
    attrs.leaderboard = [];
    attrs.game = attrs.brackets.gameObj._id;
    delete attrs.brackets.gameObj;
    if(attrs.creator.type == "user") {
      attrs.owner = Meteor.userId();
      attrs.orgEvent = false;
    }
    else {
      attrs.owner = attrs.creator.id;
      attrs.orgEvent = true;
    }
    var crObj = {};
    crObj.id = attrs.creator.id;
    crObj.type = attrs.creator.type;
    delete attrs.creator;
    var eventSlugs = [];
    var league = Leagues.insert(attrs);
    events.forEach((e) => {
      var createObj = {};
      createObj.details = attrs.details;
      createObj.details.datetime = e;
      createObj.brackets = [bracket];
      createObj.creator = crObj;
      if(attrs.stream) {
        createObj.stream = attrs.stream;
      }
      eventSlugs.push(Meteor.call("events.create", createObj, league));
    });

    var leaderboard = [];
    for(var i = 0; i < eventSlugs.length; i ++) {
      leaderboard.push({});
    }
    Leagues.update(league, {
      $set: {
        events: eventSlugs,
        leaderboard
      }
    })

    return Leagues.findOne(league).slug;
  }
})
