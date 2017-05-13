import { Banners } from "/imports/api/event/banners.js";
import Instances from "/imports/api/event/instance.js";
import Games from "/imports/api/games/games.js";
import moment from "moment";

Meteor.methods({

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
    ary.forEach((bracket, i) => {
      // if(!bracket.name || bracket.name.length < 3) {
      //   throw new Meteor.Error(403, "Bracket at " + i + " has to have a name longer than three characters.");
      // }
      if (bracket.format.baseFormat == "swiss" || bracket.format.baseFormat == "round_robin")
        bracket.score = {wins: 3, loss: 0, byes: 3, ties: 1};
      if(!bracket.game) {
        throw new Meteor.Error(403, "Bracket has to have an associated game!");
      }
    });

    return ary;
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

  "events.create"(obj, leagueID) {
    var endObj = {};
    var acceptedModules = ["details", "brackets", "organize", "crowdfunding", "stream", "tickets"];
    var requiresReview = false;
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
    var instance = Instances.insert({
      brackets: endObj.brackets,
      tickets: endObj.tickets,
      startedAt: endObj.details.datetime
    });
    delete(endObj.brackets);
    delete(endObj.tickets);
    endObj.instances = [instance];
    var eventId = Events.insert(endObj);
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
      brackets: []
    };
    if(prevInstance.brackets) {
      prevInstance.brackets.forEach(bracket => {
        var { name, game, format } = bracket;
        var bracketObj = {
          name, game, format
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
