import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";
import Notifications from "/imports/api/users/notifications.js";

Meteor.publish("user", (_id) => {
  var user = Meteor.users.findOne({_id});
  if(!user){
    return Meteor.users.find({_id});
  }
  var games = Games.find({_id: {$in: user.profile.games}});
  var imgs = ProfileImages.find({_id: user.profile.image});
  var gameBanners = Images.find({
    _id: {
      $in: games.map((g) => { return g.banner })
    }
  });
  var eventIDs = [];
  var userIDs = [];
  userIDs.push(_id);
  return [
    Meteor.users.find({_id}),
    ProfileBanners.find({_id: user.profile.banner}).cursor,
    imgs.cursor,
    games,
    gameBanners.cursor
  ];
})

Meteor.publish("userNotifications", (_id) => {
  return Notifications.find({ recipient: _id }, { limit: 4 });
})
