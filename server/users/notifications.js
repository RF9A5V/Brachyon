import Notifications from "/imports/api/users/notifications.js";

Meteor.methods({
  "users.notifications.acceptInvitation"(id) {
    var note = Notifications.findOne(id);
    var user = Meteor.users.findOne(note.recipient);
    if(note.type == "eventInvite") {
      Events.update({slug: note.eventSlug}, {
        $push: {
          [`brackets.0.participants`]: {
            id: user._id,
            alias: user.profile.alias || user.username
          }
        }
      });
    }
    else if(note.type == "eventRegistrationRequest") {
      Events.update({slug: note.eventSlug}, {
        $push: {
          [`brackets.0.participants`]: {
            id: note.userId,
            alias: note.user
          }
        }
      });
    }
    Notifications.remove({_id: id});
  },
  "users.notifications.rejectInvitation"(id) {
    Notifications.remove({_id: id});
  }
})
