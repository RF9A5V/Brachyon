import { Banners } from "/imports/api/event/banners.js";
import Instances from "/imports/api/event/instance.js";
import Games from "/imports/api/games/games.js";
import moment from "moment";

import { bracketHashGenerator } from "/imports/decorators/gen_bracket_hash.js";

Meteor.methods({

  "events.validateSlug"(slug) {
    var event = Events.findOne({
      slug: slug
    });
    if(event) {
      throw new Meteor.Error(400, "Slug taken.");
    }
  },

  "events.validate_details"(obj) {
    if(!obj.name || obj.name.length < 3) {
      throw new Meteor.Error(403, "Event name must be longer than three characters.");
    }
    if(!obj.description) {
      throw new Meteor.Error(403, "This event needs a description.");
    }
    if(!obj.location) {
      throw new Meteor.Error(403, "This event needs a location.");
    }
    if(!obj.datetime) {
      throw new Meteor.Error(403, "This event needs a start date.");
    }
    var currentDate = moment().startOf("minute");
    var eventStart = moment(obj.datetime).startOf("minute");
    if(eventStart.isBefore(currentDate)) {
      throw new Meteor.Error(403, "Event cannot start before current date.");
    }
    else {
      obj.datetime = eventStart.toDate();
    }
    delete obj.date;
    delete obj.time;
    delete obj.image;
    return obj;
  },

  "events.validate_brackets"(ary) {
    var brackets = ary.map((bracket, i) => {
      // if(!bracket.name || bracket.name.length < 3) {
      //   throw new Meteor.Error(403, "Bracket at " + i + " has to have a name longer than three characters.");
      // }
      if (bracket.format.baseFormat == "swiss" || bracket.format.baseFormat == "round_robin")
        bracket.score = {wins: 3, loss: 0, byes: 3, ties: 1};
      if(!bracket.game) {
        throw new Meteor.Error(403, "Bracket has to have an associated game!");
      }
      delete bracket.gameName;
      bracket.slug = Meteor.call("brackets.generateHash", bracket.slug || Games.findOne(bracket.game).slug);
      return bracket;
    });
    return brackets;
  },

  "events.validate_crowdfunding"(obj) {
    return {
      details: {
        amount: 0,
        dueDate: new Date(),
        current: 0
      },
      tiers: [],
      rewards: []
    }
  },

  "events.validate_stream"(obj) {
    return {
      twitchStream: {
        name: obj
      }
    }
  },

  "events.validate_tickets"(obj) {
    var ticketObj = {};
    ticketObj.paymentType = obj.paymentType;
    delete obj.paymentType;
    ticketObj.discounts = obj.discounts.map(d => {
      d["qualifiers"] = {};
      return d;
    });
    ticketObj.fees = obj.fees;
    return ticketObj;
  },

  "events.generateHash"(slug) {
    var tok = bracketHashGenerator(parseInt(Math.random() * 100));
    const conflictingEvent = Events.findOne({
      slug: slug + "-" + tok
    });
    if(conflictingEvent) {
      return Meteor.call("events.generateHash", slug);
    }
    return slug + "-" + tok;
  },

  "events.create"(obj, leagueID) {
    if(obj.isCustomSlug) {
      var conflict = Events.findOne({
        slug: obj.slug
      });
      if(conflict) {
        throw new Meteor.Error(400, "Slug is already taken.");
      }
    }
    else {
      obj.slug = Meteor.call("events.generateHash", obj.slug);
    }
    delete obj.isCustomSlug;
    (obj.brackets || []).forEach(brack => {
      if (brack.game == null){
        brack.game = Games.findOne({
          name: brack.gameName
        });
        if(brack.game) {
          brack.game = brack.game._id;
        }
        else {
          brack.game = Games.insert({
            name: brack.gameName,
            description: "",
            approved: true,
            bannerUrl: null,
            temp: true
          })
        }
      }
    });
    var endObj = {
      slug: obj.slug
    };
    var acceptedModules = ["details", "brackets", "organize", "crowdfunding", "stream", "tickets"];
    var requiresReview = false;
    delete obj.details.render;
    acceptedModules.forEach(mod => {
      if(obj[mod]) {
        if(mod == "crowdfunding") {
          requiresReview = true;
        }
        var value = Meteor.call("events.validate_" + mod, obj[mod]);
        endObj[mod] = value;
      }
    });
    endObj.published = !requiresReview;
    endObj.underReview = false;
    endObj.isComplete = false;
    if(leagueID) {
      endObj.league = leagueID;
    }
    if(obj.creator.type == "user") {
      endObj.owner = Meteor.userId();
      endObj.orgEvent = false;
    }
    else {
      endObj.owner = obj.creator.id;
      endObj.orgEvent = true;
    }
    var instObj = {
      brackets: endObj.brackets,
      tickets: endObj.tickets,
      startedAt: endObj.details.datetime
    };
    var instance = Instances.insert(instObj);
    delete(endObj.brackets);
    delete(endObj.tickets);
    endObj.instances = [instance];
    var eventId = Events.insert(endObj);
    Instances.update(instance, {
      $set: {
        event: eventId,
        league: leagueID
      }
    })
    if(endObj.brackets) {
      endObj.brackets.forEach((bracket) => {
        Games.update(bracket.game, {
          $inc: {
            eventCount: 1
          },
          $push: {
            events: event
          }
        })
      })
    }
    const event = Events.findOne(eventId);
    return {
      id: eventId,
      slug: event.slug
    };
  },

  "events.reinstantiate"(id, date) {
    var event = Events.findOne(id);
    if(event.league) {
      throw new Meteor.Error(403, "Can't reinstantiate a league event.");
    }
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var prevInstance = Instances.findOne(event.instances.pop());
    var obj = {
      brackets: [],
      event: id,
      league: event.league
    };
    if(prevInstance.brackets) {
      prevInstance.brackets.forEach(bracket => {
        var { name, game, format, slug } = bracket;
        var nextSlug = slug.split("-");
        if(nextSlug.length == 1) {
          nextSlug = nextSlug[0];
        }
        else {
          nextSlug = nextSlug.slice(0, -1).join("-");
        }
        var bracketObj = {
          name, game, format, slug: Meteor.call("brackets.generateHash", nextSlug)
        };
        obj.brackets.push(bracketObj);
      })
    }
    Instances.update(prevInstance._id, {
      $set: {
        datetime: event.details.datetime
      }
    });
    const instance = Instances.insert(obj);
    Events.update(id, {
      $push: {
        instances: instance
      },
      $set: {
        isComplete: false,
        published: true,
        "details.datetime": date
      }
    });
    return Events.findOne(id).slug;
  }
})
