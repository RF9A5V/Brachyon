import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/event/events.js';
import Images from '/imports/api/event/images.js';
import Games from '/imports/api/games/games.js';
import Icons from '/imports/api/sponsorship/icon.js';
import ProfileImages from '/imports/api/users/profile_images.js';

Events._ensureIndex({
  title: 'text'
})

Events._ensureIndex({
  'location.coords': '2dsphere'
})

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

});
