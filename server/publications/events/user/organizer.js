import { Banners } from "/imports/api/event/banners.js";
import Instances from "/imports/api/event/instance.js";

Meteor.publish("organizer.unpublishedEvents", function(id, page) {
  var events = Events.find({ owner: id, published: false, isComplete: false, underReview: false }, { limit: 6, skip: 6 * page });
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
})

Meteor.publish("organizer.eventsUnderReview", function(id, page) {
  var events = Events.find({
    owner: id,
    underReview: true,
    league: {
      $eq: null
    }
  }, { limit: 6, skip: 6 * page });
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

Meteor.publish("organizer.publishedEvents", function(id, page) {
  var events = Events.find({
    owner: id,
    published: true,
    league: {
      $eq: null
    }
  }, { limit: 6, skip: 6 * page });
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
})

Meteor.publish("organizer.completedEvents", function(id, page) {
  var events = Events.find({
    owner: id,
    isComplete: true,
    league: {
      $eq: null
    } 
  }, { limit: 6, skip: 6 * page });
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
})
