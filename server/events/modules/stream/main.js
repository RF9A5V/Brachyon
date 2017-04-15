Meteor.methods({
  "events.addModule.stream"(id) {
    Events.update(id, {
      $set: {
        "stream.twitchStream": {}
      }
    })
  },

  "events.removeModule.stream"(id) {
    Events.update(id, {
      $unset: {
        stream: 1
      }
    })
  }
})
