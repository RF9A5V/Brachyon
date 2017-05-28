import { Meteor } from 'meteor/meteor';
import moment from "moment";

var Stripe = {};

import Events from '/imports/api/event/events.js';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";
import { Banners } from "/imports/api/event/banners.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { LeagueBanners } from "/imports/api/leagues/banners.js";
import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import Leagues from "/imports/api/leagues/league.js"

import { Accounts } from 'meteor/accounts-base'

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

ServiceConfiguration.configurations.upsert({
  service: "instagram",
}, {
  $set: {
    clientId: Meteor.settings.public.instagram.client_id,
    secret: Meteor.settings.private.instagram.secret,
    scope: ["basic"]
  }
})

Accounts.emailTemplates.siteName = "Brachyon";
Accounts.emailTemplates.from = "Brachyon Admin <steven@brachyon.com>";
Accounts.emailTemplates.verifyEmail.subject = (user) => {
  return "Hi, " + user.username + "!";
}
Accounts.emailTemplates.verifyEmail.text = (user, url) => {
  return "Click the link below to verify your email!\n" + url;
}

Accounts.onEmailVerificationLink = (token, done) => {
  Accounts.verifyEmail(token, (err) => {
    if(err) {
      throw new Meteor.Error(404, "Issue with verifying email!");
    }
    else {
      done()
    }
  })
}

Accounts.urls.resetPassword = (token) => {
  return Meteor.absoluteUrl(`reset_password/${token}`)
}

Meteor.startup(() => {

  var smtp = {
    username: Meteor.settings.private.gmail.email,
    password: Meteor.settings.private.gmail.password,
    server: "smtp-relay.gmail.com",
    port: 587
  }

  process.env.MAIL_URL = `smtp://${encodeURIComponent(smtp.username)}:${encodeURIComponent(smtp.password)}@${smtp.server}:${smtp.port};`

  Logger.info('Meteor started!');

  SyncedCron.add({
    name: "Test cron",
    schedule: (parser) => {
      return parser.recur().every().hour()
    },
    job: () => {
      var events = Events.find({ "crowdfunding.details.dueDate": { $lte: new Date() }, "crowdfunding.details.complete": { $ne: true } });
      events.forEach(e => {
        if(!e.instances || e.instances.length == 0) {
          return;
        }
        var instance = Instances.findOne(e.instances.pop());
        var amountFunded = Object.keys((instance.cf || {})).map(key => {
          return instance.cf[key].length * e.crowdfunding.tiers[key].price;
        }).reduce((a, b) => { return a + b }, 0);
        if(amountFunded >= e.crowdfunding.details.amount && amountFunded > 0) {
          var destination = Meteor.users.findOne(e.owner).services.stripe.id;
          Object.keys(instance.cf).forEach(index => {
            instance.cf[index].forEach(obj => {
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
  });

  Migrations.migrateTo(4);
  // SyncedCron.add({
  //   name: "Clear Test Brackets",
  //   schedule: (parser) => {
  //     return parser.recur().every(24).hour()
  //   },
  //   job: () => {
  //     var instances = Instances.find({ owner: { $ne: null }, "brackets.startedAt": { $lte: moment().subtract(1, "day").toDate() } });
  //     var brackets = Brackets.find({ _id: { $in: instances.map(i => { return i.brackets[0].id }) } }).map(b => { return b._id });
  //     Instances.remove({ _id: { $in: instances.map(i => { return i._id }) } });
  //     Brackets.remove({ _id: { $in: brackets } });
  //   }
  // })

  SyncedCron.start();
});
