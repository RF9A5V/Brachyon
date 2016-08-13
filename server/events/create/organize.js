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
  },
  "events.deleteOrganizationBracket"(eventID, bracketIndex) {
    Events.update(eventID, {
      $unset: {
        [`organize.${bracketIndex}`]: 1
      }
    });
    Events.update(eventID, {
      $pull: {
        organize: null
      }
    })
  }
})
