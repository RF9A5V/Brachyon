Meteor.methods({
  "events.promotion.create"(id) {
    Events.update(id, {
      $set: {
        "promotion": {
          featured: []
        }
      }
    })
  },
  "events.promotion.delete"(id) {
    Events.update(id, {
      $unset: {
        "promotion": 1
      }
    })
  }
})
