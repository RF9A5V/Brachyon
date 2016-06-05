import { Meteor } from 'meteor/meteor';
import Events from '/imports/api/event/events.js';
import Images from '/imports/api/event/images.js';

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
