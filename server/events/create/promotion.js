Meteor.methods({
  "events.updatePromotionBid"(id, amount) {
    Events.update(id, {
      $set: {
        "promotion.bid": amount
      }
    })
  }
})
