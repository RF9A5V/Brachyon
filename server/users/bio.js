Meteor.methods({
  "user.editBio"(id, bio) {
    Meteor.users.update(id, {
      $set: {
        "profile.bio": bio
      }
    });
  }
})
