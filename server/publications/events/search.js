import Games from '/imports/api/games/games.js';

import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";

Meteor.publish("searchEvents", (params) => {
  var query = Meteor.call("events.search", params);
  var events = Events.find(query, { limit: 6 });

  var gameSet = new Set();
  var ownerIDs = new Set();
  var imgIDs = [];

  events.forEach((e) => {
    if(e.brackets != null){
      e.brackets.forEach((brack) => {
        gameSet.add(brack.game);
      })
    }
    if(e.details.banner != null){
      imgIDs.push(e.details.banner);
    }
    ownerIDs.add(e.owner);
  });
  var games = Games.find({_id: { $in: Array.from(gameSet) }});
  games.forEach((game) => {
    imgIDs.push(game.banner);
  });
  var usrs = Meteor.users.find({_id: { $in: Array.from(ownerIDs) }});
  var imgs = Images.find({ _id: { $in: imgIDs } });
  var profImgs = ProfileImages.find({_id: { $in: usrs.map((usr) => { return (usr.profile || {}).image }) }})
  var instances = events.map((event) => {
    return event.instances.pop();
  })
  return [
    events,
    games,
    imgs.cursor,
    Meteor.users.find({_id: { $in: Array.from(ownerIDs) }}),
    profImgs.cursor,
    Instances.find({ _id: { $in: instances } })
  ];
});
