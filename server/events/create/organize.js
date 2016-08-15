Meteor.methods({
  "events.updateOrganizationBracket"(eventID, bracketIndex, value) {
    Events.update(eventID, {
      $set: {
        [`organize.${bracketIndex}`]: value
      }
    })
  }
})
