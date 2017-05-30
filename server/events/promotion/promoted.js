Meteor.methods({
  "events.addCFSponsor"(id) {
    const event = Events.findOne(id);
    if(!event.crowdfunding) {
      throw new Meteor.Error(400, "Can't update event that's not sponsored.");
    }
    Events.update(id, {
      $addToSet: {
        "crowdfunding.users": Meteor.userId()
      }
    })
  },
  "events.getPromoters"(users) {
    var promoters = Meteor.users.find({
      _id: {
        $in: users
      }
    }, {
      fields: {
        username: 1,
        "profile.imageUrl": 1
      }
    });
    return promoters.fetch();
  }
})
