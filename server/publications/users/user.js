import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import Notifications from "/imports/api/users/notifications.js";

Meteor.publish("user", (_id) => {
  var user = Meteor.users.findOne({_id});
  if(!user){
    return Meteor.users.find({_id});
  }
  var games = Games.find({_id: {$in: Object.keys(user.stats || {})}});
  var eventIDs = [];
  var userIDs = [];
  userIDs.push(_id);
  // var orgs = Organizations.find({
  //   $or: [
  //     {
  //       owner: _id
  //     },
  //     {
  //       "roles.Owner": _id
  //     }
  //   ]
  // });
  return [
    Meteor.users.find({_id}),
    games,
    //orgs
  ];
})

Meteor.publish("userNotifications", (_id) => {
  return Notifications.find({ recipient: _id }, { limit: 4 });
})

Meteor.publish("getUserByUsername", (username) => {
  console.log(username);
  const user = Meteor.users.findOne({
    username
  });
  return [
    Meteor.users.find({
      username
    }),
    Games.find({
      _id: {
        $in: Object.keys(user.stats || {})
      }
    })
  ]
})
