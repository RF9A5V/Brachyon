import { ProfileImages } from "/imports/api/users/profile_images.js";

Migrations.add({
  version: 1,
  up: function() {
    // var usersWithImage = Meteor.users.find({"profile.image": { $ne: null }}, { _id: 1, "profile.image": 1 });
    // usersWithImage.forEach((usr) => {
    //   var img = ProfileImages.findOne(usr.profile.image);
    //   if(img) {
    //     Meteor.users.update(usr._id, {
    //       $set: {
    //         "profile.imageUrl": img.link()
    //       }
    //     });
    //   }
    // });
  },
  down: function() {
    var usersWithImage = Meteor.users.find({"profile.imageUrl": { $ne: null }}, { _id: 1, "profile.image": 1 });
    usersWithImage.forEach(usr => {
      Meteor.users.update(usr._id, {
        $set: {
          "profile.imageUrl": null
        }
      })
    })
  }
})
