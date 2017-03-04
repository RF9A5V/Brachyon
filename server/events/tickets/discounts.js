Meteor.methods({
  "tickets.activateDiscount"(instanceId, ticketId, discountIndex, userId) {
    Instances.update(instanceId, {
      $set: {
        [`tickets.${ticketId}.discounts.${discountIndex}.qualifiers.${userId}`]: true
      }
    })
  },
  "tickets.deactivateDiscount"(instanceId, ticketId, discountIndex, userId) {
    Instances.update(instanceId, {
      $set: {
        [`tickets.${ticketId}.discounts.${discountIndex}.qualifiers.${userId}`]: false
      }
    })
  }
})
