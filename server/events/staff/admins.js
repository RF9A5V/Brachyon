Meteor.methods({
  "event.staff.admins"(id) {
    const event = Events.findOne(id);
    const admins = (event.staff || {}).admins || [];
    if(admins.length == 0) {
      return admins;
    }
    return Meteor.users.find({
      _id: {
        $in: admins
      }
    }, {
      fields: {
        "profile.imageUrl": 1,
        username: 1
      }
    }).fetch();
  },
  "event.staff.loadAdminCandidates"(queryString) {
    var users = Meteor.users.find({
      username: new RegExp(queryString, "i")
    }, {
      fields: {
        "profile.imageUrl": 1,
        username: 1
      },
      limit: 10
    });
    return users.fetch();
  },
  "event.staff.addAdmin"(eventId, userId) {
    Events.update(eventId, {
      $addToSet: {
        "staff.admins": userId
      }
    });
  }
})
