import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/event/events.js';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Images } from "/imports/api/event/images.js";
import Games from '/imports/api/games/games.js';
import Icons from '/imports/api/sponsorship/icon.js';
import ProfileBanners from "/imports/api/users/profile_banners.js";

Events._ensureIndex({
  'details.location.coords': '2dsphere'
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

  Logger.info('Meteor started!')

  // SyncedCron.add({
  //   name: "Test cron job",
  //   schedule: function(parser){
  //     return parser.recur().every().minute()
  //   },
  //   job: function() {
  //     console.log("Job run!");
  //     return true;
  //   }
  // })

  SyncedCron.start();

  Icons.allow({
    insert: function() {
      return true;
    },
    update:function(userId,project,fields,modifier){
     return true;
    },
    remove:function(userId,project){
      return true;
    },
    download:function(){
      return true;
    }
  })

});
