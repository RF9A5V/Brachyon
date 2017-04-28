Meteor.methods({
  "users.twitter.shareEvent"(eventId, url) {
    const event = Events.findOne(eventId);
    const user = Meteor.user();
    if(event.promotion && event.promotion.twitter && event.promotion.twitter.indexOf(user._id) >= 0) {
      throw new Meteor.Error(403, "Already shared link!")
    }

    if(!user.services.twitter) {
      throw new Meteor.Error(404, "You need to integrate Twitter first!");
    }

    const T = new TwitMaker({
      consumer_key: Meteor.settings.public.twitter.consumerKey,
      consumer_secret: Meteor.settings.private.twitter.liveSecretKey,
      access_token: user.services.twitter.accessToken,
      access_token_secret: user.services.twitter.accessTokenSecret
    });
    Events.update(eventId, {
      $push: {
        "promotion.twitter": user._id
      }
    });
    T.post("statuses/update", {
      status: "Check out " + event.details.name + " @ " + Meteor.absoluteUrl() + "_" + url
    }, (err, data, res) => {
      if(err) {
        console.log(err);
      }
    })
  },
  "users.facebook.shareEvent"(eventId, url) {
    const event = Events.findOne(eventId);
    const user = Meteor.user();
    if(event.promotion && event.promotion.facebook && event.promotion.facebook.indexOf(user._id) >= 0) {
      throw new Meteor.Error(403, "Already shared link!")
    }
    if(!user.services.facebook) {
      throw new Meteor.Error(404, "You need to integrate Facebook first!");
    }
    FBGraph.setAccessToken(user.services.facebook.accessToken);
    var post = {
      message: "Check out " + event.details.name + " at " + Meteor.absoluteUrl() + "_" + url + " at Brachyon!",
    }
    Events.update(eventId, {
      $push: {
        "promotion.facebook": user._id
      }
    });
    FBGraph.post(user.services.facebook.id + "/feed", post, (err, res) => {
      console.log(res);
    });

  }
})
