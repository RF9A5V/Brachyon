import { Images } from "/imports/api/event/images.js";

Meteor.publish("spectator.upcomingEvents", function(id, page) {
  var events = Events.find({
    published: true,
    [`tickets.ticketAccess.${id}`]: "spectator",
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

Meteor.publish("spectator.ongoingEvents", function(id, page) {
  var events = Events.find({
    published: true,
    [`tickets.ticketAccess.${id}`]: "spectator",
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

Meteor.publish("spectator.completedEvents", function(id, page) {
  var events = Events.find({
    isComplete: true,
    [`tickets.ticketAccess.${id}`]: "spectator",
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
