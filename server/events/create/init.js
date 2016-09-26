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
    return obj;
  },

  "events.validate_brackets"(ary) {
    ary.forEach((bracket, i) => {
      if(!bracket.name || bracket.name.length < 3) {
        throw new Meteor.Error(403, "Bracket at " + i + " has to have a name longer than three characters.");
      }
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

  "events.create"(obj) {
    var endObj = {};
    var acceptedModules = ["details", "brackets", "organize", "crowdfunding"];
    var requiresReview = false;
    acceptedModules.forEach(mod => {
      if(obj[mod]) {
        requiresReview = true;
        var value = Meteor.call("events.validate_" + mod, obj[mod]);
        endObj[mod] = value;
      }
    });
    endObj.published = !requiresReview;
    return Events.insert(endObj);
  }
})
