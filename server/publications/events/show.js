import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Icons } from "/imports/api/sponsorship/icon.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

Meteor.publish('event', (slug, hash) => {
  var query = { slug };
  if(hash) {
    query.hash = hash;
  }
  var event = Events.findOne(query);
  if(!event) {
    return [];
  }
  var _id = event._id;
  var instanceIndex = event.instances.length - 1;
  var instance = Instances.findOne(event.instances[instanceIndex]);
  var gameIDs = [];
  var userIDs = [];
  if(instance.brackets) {
    instance.brackets.forEach(bracket => {
      gameIDs.push(bracket.game);
      userIDs = userIDs.concat((bracket.participants || []).map(p => { return p.id }));
    });
  }
  return [
    Events.find({_id}, { sort: { "crowdfunding.tiers.price": 1 } }),
    Banners.find({
      _id: event.details.banner
    }).cursor,
    Instances.find({ _id: instance._id }),
    Games.find({_id: { $in: gameIDs }}),
    Meteor.users.find({ _id: { $in: userIDs } })
  ];
});
