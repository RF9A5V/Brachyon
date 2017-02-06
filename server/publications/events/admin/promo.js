Meteor.publish("events.getByPromoted", () => {
  return Events.find({}, {
    sort: {
      "promotion.bid": -1
    }
  })
})

// Eh whatever

Meteor.methods({
  "events.setPromotionValue": (_id, value) => {
    Events.update(_id, {
      $set: {
        "promotion.bid": value
      }
    })
  },
  "events.setPromotionActive": (_id, active) => {
    Events.update(_id, {
      $set: {
        "promotion.active": active
      }
    })
  }
})
