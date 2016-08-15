Meteor.methods({
  "events.updateDetailsName"(id, name) {
    // Validation
    console.log(name);
    Events.update(id, {
      $set: {
        "details.name": name
      }
    });
  },
  "events.updateDetailsBanner"(id, bannerID) {
    Events.update(id, {
      $set: {
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
