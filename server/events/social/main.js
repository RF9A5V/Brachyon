Meteor.methods({
  "users.twitter.shareEvent"(eventId, url, options) {
    const event = Events.findOne(eventId);
    const user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(403, "You need to be logged for this!");
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
      $addToSet: {
        "promotion.twitter": user._id
      }
    });

    var status;
    const link = Meteor.absoluteUrl() + "event/" + event.slug;
    if(options.registration) {
      status = "Just registered for " + event.details.name + "! " + link
    }
    else {
      status = "Check out " + event.details.name + "! " + link;
    }

    T.post("statuses/update", {
      status
    }, (err, data, res) => {
      if(err) {
        console.log(err);
      }
    })
  },
  "users.facebook.shareEvent"(eventId, url, options) {
    const event = Events.findOne(eventId);
    const user = Meteor.user();

    if(!user) {
      throw new Meteor.Error(403, "You need to be logged in for this!");
    }
    if(!user.services.facebook) {
      throw new Meteor.Error(404, "You need to integrate Facebook first!");
    }

    FBGraph.setAccessToken(Meteor.settings.public.facebook.testAppId + "|" + Meteor.settings.private.facebook.testAppSecret);
    var message;
    if(options.registration) {
      message = "Just registered for " + event.details.name + "!"
    }
    else {
      message = "Check out " + event.details.name + " at Brachyon!"
    }
    const link = Meteor.absoluteUrl() + "event/" + event.slug;
    FBGraph.post(`/${user.services.facebook.id}/feed`, {
      message,
      link: "https://www.brachyon.com/event/sfv-game-realms"
    }, (res) => {
      console.log(res);
    })

    Events.update(eventId, {
      $addToSet: {
        "promotion.facebook": user._id
      }
    });

  }
})
