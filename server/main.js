import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/event/events.js';
import Images from '/imports/api/event/images.js';

ServiceConfiguration.configurations.remove({service: "stripe"});

Events._ensureIndex({
  title: 'text'
})

Events._ensureIndex({
  'location.coords': '2dsphere'
})

ServiceConfiguration.configurations.insert({
  service: 'stripe',
  appId: Meteor.settings.public.stripe.client_id,
  secret: Meteor.settings.private.stripe.testSecretKey,
  scope: 'read_write'
});

Meteor.startup(() => {

  Logger.info('Meteor started!')

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

});
