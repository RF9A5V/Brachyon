import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/event/events.js';
import Images from '/imports/api/event/images.js';
import Games from '/imports/api/games/games.js';
import Icons from '/imports/api/sponsorship/icon.js';
import ProfileImages from '/imports/api/users/profile_images.js';
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

Meteor.startup(() => {

  Logger.info('Meteor started!')

  SyncedCron.start();

  Images.allow({
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

  ProfileImages.allow({
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

  ProfileBanners.allow({
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
