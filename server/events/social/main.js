Meteor.methods({
  "users.twitter.share"(text, url, options) {
    const user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(403, "You need to be logged for this!");
    }
    if(!user.services.twitter) {
      throw new Meteor.Error(404, "You need to integrate Twitter first!");
    }

    var content;
    switch(options.type) {
      case "event":
        content = Events.findOne(options.id);
        break;
      case "league":
        content = Leagues.findOne(options.id);
        break;
      default:
        content = "";
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
    var link = Meteor.absoluteUrl() + "_" + url;
    if(options.registration) {
      status = "Just registered for " + content.details.name + "! " + link
    }
    else {
      status = "Check out " + content.details.name + "! " + link;
    }

    T.post("statuses/update", {
      status
    }, (err, data, res) => {
      if(err) {
        console.log(err);
      }
    })
  },
  "users.facebook.share"(eventId, url, options) {
    const user = Meteor.user();

    if(!user) {
      throw new Meteor.Error(403, "You need to be logged in for this!");
    }
    if(!user.services.facebook) {
      throw new Meteor.Error(404, "You need to integrate Facebook first!");
    }

    var content;
    switch(options.type) {
      case "event":
        content = Events.findOne(options.id);
        break;
      case "league":
        content = Leagues.findOne(options.id);
        break;
      default:
        content = "";
    }

    FBGraph.setAccessToken(Meteor.settings.public.facebook.testAppId + "|" + Meteor.settings.private.facebook.testAppSecret);
    var message;
    if(options.registration) {
      message = "Just registered for " + content.details.name + "!"
    }
    else {
      message = "Check out " + content.details.name + " at Brachyon!"
    }
    var link;
    if(Meteor.isDevelopment) {
      link = "https://www.brachyon.com/event/sfv-game-realms";
    }
    else {
      link = Meteor.absoluteUrl() + "_" + url;
    }
    FBGraph.post(`/${user.services.facebook.id}/feed`, {
      message,
      link
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
