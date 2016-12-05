import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Icons } from "/imports/api/sponsorship/icon.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

Meteor.publish('event', (slug) => {
  var event = Events.findOne({slug: slug});
  var _id = event._id;
  var instanceIndex = event.instances.length - 1;
  var instance = Instances.findOne(event.instances.pop());
  var gameIDs = [];
  var banners = [];
  if(instance.brackets) {
    gameIDs = instance.brackets.map(bracket => {
      return bracket.game;
    })
  }
  Games.find({_id: { $in: gameIDs }}).forEach(game => {
    banners.push(game.banner);
  })
  return [
    Events.find({_id}, { sort: { "crowdfunding.tiers.price": 1 } }),
    Banners.find({
      _id: event.details.banner
    }).cursor,
    Instances.find({ _id: instance._id }),
    Games.find({_id: { $in: gameIDs }}),
    GameBanners.find({ _id: { $in: banners } }).cursor
  ];
});
