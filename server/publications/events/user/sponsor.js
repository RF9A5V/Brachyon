import { Banners } from "/imports/api/event/banners.js";
import Instance from "/imports/api/event/instance.js";

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
  var imgs = Banners.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor,
    Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } })
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
  var imgs = Banners.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor,
    Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } })
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
  var imgs = Banners.find({
    _id: {
      $in: events.map((e) => { return e.details.banner })
    }
  });
  return [
    events,
    imgs.cursor,
    Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } })
  ]
});
