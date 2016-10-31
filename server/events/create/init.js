import { Images } from "/imports/api/event/images.js";
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
    var currentDate = moment().minute(0).second(0).millisecond(0);
    var eventStart = moment(obj.datetime).minute(0).second(0).millisecond(0);
    if(eventStart.isBefore(currentDate)) {
      throw new Meteor.Error(403, "Event cannot start before current date.");
    }
    if(obj.banner) {
      obj.bannerUrl = Images.findOne(image).link();
    }
    return obj;
  },

  "events.validate_brackets"(ary) {
    ary.forEach((bracket, i) => {
      // if(!bracket.name || bracket.name.length < 3) {
      //   throw new Meteor.Error(403, "Bracket at " + i + " has to have a name longer than three characters.");
      // }
      if(!bracket.game) {
        throw new Meteor.Error(403, "Bracket has to have an associated game!");
      }
    })
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
        name: null,
        chat: null
      }
    }
  },

  "events.create"(obj) {
    var endObj = {};
    var acceptedModules = ["details", "brackets", "organize", "crowdfunding", "stream"];
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
    endObj.owner = Meteor.userId();
    var event = Events.insert(endObj);
    return Events.findOne(event).slug;
  }
})
