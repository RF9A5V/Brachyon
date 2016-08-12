Meteor.methods({
  "events.updateOrganizationBracket"(eventID, bracketIndex, value) {
    Events.update(eventID, {
      $set: {
        [`organize.${bracketIndex}`]: value
      }
    })
  },
  "events.addOrganizationBracket"(eventID, value) {
    Events.update(eventID, {
      $push: {
        organize: value
      }
    });
  }
})
