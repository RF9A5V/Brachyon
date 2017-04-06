Meteor.methods({
  "tickets.activateDiscount"(instanceId, ticketId, discountIndex, userId) {
    Instances.update(instanceId, {
      $set: {
        [`tickets.discounts.${discountIndex}.qualifiers.${userId}`]: true
      }
    })
  },
  "tickets.deactivateDiscount"(instanceId, ticketId, discountIndex, userId) {
    Instances.update(instanceId, {
      $unset: {
        [`tickets.discounts.${discountIndex}.qualifiers.${userId}`]: 1
      }
    })
  }
})
