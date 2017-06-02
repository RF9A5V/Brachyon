import Twitter from "twitter";
import FB from "fb";

Meteor.methods({
  "user.unlinkFB"() {
    Accounts.unlinkService(Meteor.userId(), "facebook");
  },
  "user.unlinkTwitter"() {
    Accounts.unlinkService(Meteor.userId(), "twitter");
  },
  "user.unlinkTwitch"() {
    Accounts.unlinkService(Meteor.userId(), "twitch");
  },
  "user.unlinkInsta"() {
    Accounts.unlinkService(Meteor.userId(), "instagram");
  },
  "user.shareViaTwitter"(tweet) {
    if(tweet.length > 140) {
      throw new Meteor.Error(400, "Tweet must be less than 140 characters.");
    }
    const user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(400, "You must be logged in to access this action.");
    }
    if(!user.services.twitter) {
      throw new Meteor.Error(400, "You must have Twitter integrated with your account to access this action.");
    }
    var client = new Twitter({
      consumer_key: Meteor.isDevelopment ? Meteor.settings.public.twitter.testConsumerKey : Meteor.settings.public.twitter.liveConsumerKey,
      consumer_secret: Meteor.isDevelopment ? Meteor.settings.private.twitter.testConsumerSecret : Meteor.settings.private.twitter.liveConsumerSecret,
      access_token_key: user.services.twitter.accessToken,
      access_token_secret: user.services.twitter.accessTokenSecret
    });
    var func = Meteor.wrapAsync(client.post, client);
    var val = func("statuses/update", {
      status: tweet
    });
  },
  "user.shareViaFacebook"(text) {
    const user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(400, "You must be logged in to access this action.");
    }
    if(!user.services.facebook) {
      throw new Meteor.Error(400, "You must have Facebook integrated with your account to access this action.");
    }
    FB.setAccessToken(user.services.facebook.accessToken);
    FB.api("me/feed", "post", { message: text }, (res) => {
      console.log(res);
    })
  }
})
