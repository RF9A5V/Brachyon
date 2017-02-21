import twitterAPI from "node-twitter-api";

const tweetHandler = new twitterAPI({
  consumerKey: Meteor.settings.private.consumerKey,
  consumerSecret: Meteor.settings.private.consumerSecret
});

export default tweetHandler;
