import Leagues from "/imports/api/leagues/league.js";
import Games from "/imports/api/games/games.js";

Meteor.methods({
  "leagues.create"(attrs) {
    if (attrs.brackets.game == null){
        if(Games.findOne({name:attrs.brackets.gameName}) == null){
          Games.insert({
            name: attrs.brackets.gameName,
            description: "",
            approved: true,
            bannerUrl:"/images/bg.jpg",
            temp:true
          })
          var newGame = Games.findOne({name: attrs.brackets.gameName});
          attrs.brackets.game = newGame._id;
        }
        else{
          var newGame = Games.findOne({name: attrs.brackets.gameName});
          attrs.brackets.game = newGame._id;
        }
      }
    var events = attrs.events;
    var bracket = JSON.parse(JSON.stringify(attrs.brackets));
    delete attrs.brackets;
    attrs.leaderboard = [];
    attrs.game = bracket.game;
    if(attrs.creator.type == "user") {
      attrs.owner = Meteor.userId();
      attrs.orgEvent = false;
    }
    else {
      attrs.owner = attrs.creator.id;
      attrs.orgEvent = true;
    }
    attrs.details.datetime = attrs.events[0];
    var crObj = {};
    crObj.id = attrs.creator.id;
    crObj.type = attrs.creator.type;
    delete attrs.creator;
    var eventSlugs = [];
    var tickObj;
    if(attrs.tickets) {
      tickObj = JSON.parse(JSON.stringify(attrs.tickets));
      delete attrs.tickets;
    }
    var league = Leagues.insert(attrs);
    events.forEach((e) => {
      var createObj = {};
      createObj.details = attrs.details;
      createObj.details.datetime = e;
      createObj.brackets = [bracket];
      createObj.creator = crObj;
      if(tickObj) {
        createObj.tickets = tickObj;
      }
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
