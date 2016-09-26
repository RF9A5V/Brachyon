Meteor.methods({
  "events.brackets.create"(id, subName) {
    Events.update(id, {
      $set: {
        brackets: []
      }
    })
  },
  "events.brackets.delete"(id, subName) {
    Events.update(id, {
      $unset: {
        brackets: ""
      }
    })
  }
})
