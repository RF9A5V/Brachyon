Meteor.methods({
  "user.unlinkFB"() {
    Accounts.unlinkService(Meteor.userId(), "facebook");
  },
  "user.unlinkTwitter"() {
    Accounts.unlinkService(Meteor.userId(), "twitter");
  },
  "user.unlinkTwitch"() {
    Accounts.unlinkService(Meteor.userId(), "twitch");
  }
})
