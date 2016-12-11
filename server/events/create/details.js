import { Banners } from "/imports/api/event/banners.js";

Meteor.methods({
  "events.updateDetailsName"(id, name) {
    // Validation
    Events.update(id, {
      $set: {
        "details.name": name
      }
    });
  },
  "events.updateDetailsBanner"(id, bannerID) {
    console.log(id);
    Events.update(id, {
      $set: {
        "details.bannerUrl": Banners.findOne(bannerID).link(),
        "details.banner": bannerID
      }
    });
  },
  "events.updateDetailsLocation"(id, location) {
    Events.update(id, {
      $set: {
        "details.location": location
      }
    })
  },
  "events.updateDetailsDescription"(id, description) {
    Events.update(id, {
      $set: {
        "details.description": description
      }
    })
  },
  "events.updateDetailsStartTime"(id, startTime) {
    Events.update(id, {
      $set: {
        "details.startTime": startTime
      }
    })
  }
})
