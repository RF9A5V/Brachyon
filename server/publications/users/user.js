import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import Notifications from "/imports/api/users/notifications.js";

Meteor.publish("user", (_id) => {
  var user = Meteor.users.findOne({_id});
  if(!user){
    return Meteor.users.find({_id});
  }
  var games = Games.find({_id: {$in: user.profile.games || []}});
  var eventIDs = [];
  var userIDs = [];
  userIDs.push(_id);
  return [
    Meteor.users.find({_id}),
    games,
  ];
})

Meteor.publish("userNotifications", (_id) => {
  return Notifications.find({ recipient: _id }, { limit: 4 });
})
