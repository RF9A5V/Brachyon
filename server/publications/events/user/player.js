import { Images } from "/imports/api/event/images.js";

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

Meteor.publish("player.ongoingEvents", function(id, page) {
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
