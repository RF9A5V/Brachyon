import Leagues from "/imports/api/leagues/league.js";
import Games from "/imports/api/games/games.js";

import { bracketHashGenerator } from "/imports/decorators/gen_bracket_hash.js";

Meteor.methods({

  "leagues.validateSlug"(slug) {
    const league = Leagues.findOne({
      slug
    });
    if(league) {
      throw new Meteor.Error(400, "Slug taken.");
    }
  },

  "leagues.generateHash"(slug) {
    var tok = bracketHashGenerator(parseInt(Math.random() * 100));
    const conflictingEvent = Events.findOne({
      slug: slug + "-" + tok
    });
    if(conflictingEvent) {
      return Meteor.call("events.generateHash", slug);
    }
    return slug + "-" + tok;
  },

  "leagues.create"(attrs) {
    var slugCopy = attrs.slug.slice();
    if(attrs.isCustomSlug) {
      const conflict = Leagues.findOne({
        slug: attrs.slug
      });
      if(conflict) {
        throw new Meteor.Error(400, "Slug taken.");
      }
    }
    else {
      attrs.slug = Meteor.call("leagues.generateHash", attrs.slug);
    }
    delete attrs.isCustomSlug;
    if (attrs.brackets.game == null){
      var game = Games.findOne({
        name: attrs.brackets.gameName
      });
      if(!game){
        game = Games.insert({
          name: attrs.brackets.gameName,
          description: "",
          approved: true,
          bannerUrl:null,
          temp:true
        })
      }
      delete attrs.brackets.gameName;
      attrs.brackets.game = game._id;
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
    events.forEach((e, i) => {
      var createObj = {};
      createObj.details = attrs.details;
      createObj.details.datetime = e;
      createObj.slug = slugCopy;
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

    return attrs.slug;
  }
})
