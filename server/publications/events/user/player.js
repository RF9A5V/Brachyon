import { Banners } from "/imports/api/event/banners.js";
import Instances from "/imports/api/event/instance.js";

Meteor.publish("player.upcomingEvents", function(id, page) {
  var events = Events.find({
    published: true,
    brackets: {
      $elemMatch: {
        participants: {
          $elemMatch: {
            id
          }
        }
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

Meteor.publish("player.ongoingEvents", function(id, page) {
  var instances = Instances.find({
    "brackets.participants.id": id
  });
  var events = Events.find({
    published: true,
    instances: { $in: instances.map(i => { return i._id }) }
  }, { sort: { "details.datetime": 1 } });
  return [
    events,
    Instances.find({ _id: { $in: events.map(e => { return e.instances.pop() }) } })
  ]
})

Meteor.publish("player.pastEvents", function(id, page) {
  var events = Events.find({
    isComplete: true,
    brackets: {
      $elemMatch: {
        participants: {
          $elemMatch: {
            id
          }
        }
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
