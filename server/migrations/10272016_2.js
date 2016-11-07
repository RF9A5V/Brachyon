import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

Migrations.add({
  version: 2,
  up: function() {
    var userImage = Meteor.users.find({"profile.image": { $ne: null }}, { "profile.image": 1});
    userImage.forEach( ussr => {
      Meteor.users.update( ussr._id, {
        $set: {
          "profile.imageUrl": ProfileImages.findOne(ussr.profile.image).link()
        }
      });
    });

    var eventImage = Events.find({"details.banner": {$ne: null}}, {"details.banner": 1});
    eventImage.forEach( event => {
      Events.update(event._id, {
        $set: {
          "details.bannerUrl": Images.findOne(event.details.banner).link()
        }
      });
    });
  },
  down: function() {
  }
})
