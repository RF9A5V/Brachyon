import { Images } from "/imports/api/event/images.js";

Meteor.publish("sponsor.upcomingEvents", function(id, page) {
  var events = Events.find({
    published: true,
    "crowdfunding.sponsors": {
      $elemMatch: {
        id
      }
    },
    "details.datetime": {
      $gt: new Date()
    }
  });
  var imgs = Images.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor
  ]
});

Meteor.publish("sponsor.ongoingEvents", function(id, page) {
  var events = Events.find({
    published: true,
    "crowdfunding.sponsors": {
      $elemMatch: {
        id
      }
    },
    "details.datetime": {
      $lte: new Date()
    }
  });
  var imgs = Images.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor
  ]
});

Meteor.publish("sponsor.completedEvents", function(id, page) {
  var events = Events.find({
    isComplete: true,
    "crowdfunding.sponsors": {
      $elemMatch: {
        id
      }
    }
  });
  var imgs = Images.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor
  ]
});
