import { Meteor } from 'meteor/meteor';

var Stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

import Events from '/imports/api/event/events.js';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";
import { Banners } from "/imports/api/event/banners.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { LeagueBanners } from "/imports/api/leagues/banners.js";
import Games from '/imports/api/games/games.js';
import Notifications from "/imports/api/users/notifications.js";
import Instances from "/imports/api/event/instance.js";
import Leagues from "/imports/api/leagues/league.js"

Events._ensureIndex({
  'details.location.coords': '2dsphere',
  slug: 1
});

Games._ensureIndex({
  slug: 1
})

Leagues._ensureIndex({
  slug: 1
})

Notifications._ensureIndex({
  "recipient": 1
})

ServiceConfiguration.configurations.upsert(
  {service: "stripe"},
  {
    $set:
    {
      appId: Meteor.settings.public.stripe.client_id,
      secret: Meteor.settings.private.stripe.testSecretKey,
      scope: 'read_write'
    }
  });

ServiceConfiguration.configurations.upsert(
  {service: "facebook"},
  {
    $set: {
      appId: Meteor.settings.public.facebook.testAppId,
      secret: Meteor.settings.private.facebook.testAppSecret
    }
  }
);

ServiceConfiguration.configurations.upsert(
  {service: "twitch"},
  {
    $set: {
      clientId: Meteor.settings.public.twitch.client_id,
      redirectUri: Meteor.absoluteUrl() + '_oauth/twitch?close',
      secret: Meteor.settings.private.twitch.liveSecretKey
    }
  }
);

ServiceConfiguration.configurations.upsert(
  {service: "twitter"},
  {
    $set: {
      consumerKey: Meteor.settings.public.twitter.consumerKey,
      secret: Meteor.settings.private.twitter.liveSecretKey
    }
  }
);

ServiceConfiguration.configurations.upsert(
  {service: "google"},
  {
    $set: {
      clientId: Meteor.settings.public.google.client_id,
      secret: Meteor.settings.private.google.liveSecretKey
    }
  }
);

Meteor.startup(() => {



  Logger.info('Meteor started!');

  SyncedCron.add({
    name: "Test cron",
    schedule: (parser) => {
      return parser.recur().every().hour()
    },
    job: () => {
      var events = Events.find({ "crowdfunding.details.dueDate": { $lte: new Date() }, "crowdfunding.details.complete": { $ne: true } });
      events.forEach(e => {
        var instance = Instances.findOne(e.instances.pop());
        var amountFunded = Object.keys((instance.cf || {})).map(key => {
          return instance.cf[key].length * e.crowdfunding.tiers[key].price;
        }).reduce((a, b) => { return a + b }, 0);
        if(amountFunded >= e.crowdfunding.details.amount && amountFunded > 0) {
          var destination = Meteor.users.findOne(e.owner).services.stripe.id;
          Object.keys(instance.cf).forEach(index => {
            instance.cf[index].forEach(obj => {
              console.log(obj);
              Stripe.charges.create({
                amount: obj.amount,
                customer: Meteor.users.findOne(obj.payee).stripeCustomer,
                currency: "usd",
                application_fee: (parseInt(obj.amount * 0.029) + 30) + parseInt(obj.amount * 0.04),
                destination
              })
            })
          });
        }
      });
      Events.update({
        "crowdfunding.details.dueDate": {
           $lte: new Date()
         },
         "crowdfunding.details.complete": { $ne: true }
      }, {
         $set: {
           "crowdfunding.details.complete": true
         }
      });
    }
  })

  SyncedCron.start();
});
