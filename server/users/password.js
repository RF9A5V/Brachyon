Meteor.methods({
  "users.requestPWReset"(email) {
    var user = Meteor.users.findOne({
      "emails.address": email
    });
    if(!user) {
      throw new Meteor.Error(404, "Couldn't find a user with that email!");
    }
    Accounts.sendResetPasswordEmail(user._id);
  }
})
