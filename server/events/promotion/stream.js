Meteor.methods({
  "events.updateTwitchStream"(id, name) {
    Events.update(id, {
      $set: {
        "twitchStream.name": name
      }
    })
  }
});
