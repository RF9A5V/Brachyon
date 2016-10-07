Meteor.methods({
  "events.crowdfunding.create"(id, subName) {
    Events.update(id, {
      $set: {
        crowdfunding: {
          details: {
            current: 0,
            amount: 0,
            dueDate: new Date()
          },
          rewards: [],
          tiers: []
        }
      }
    })
  },
  "events.crowdfunding.delete"(id, subName) {
    if(subName == "main") {
      Events.update(id, {
        $unset: {
          crowdfunding: ""
        }
      });
    }
  }
})
