import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Icons } from "/imports/api/sponsorship/icon.js";

Meteor.publish('event', (slug) => {
  var event = Events.findOne({slug: slug});
  var _id = event._id;
  var banners = [event.details.banner];
  var instanceIndex = event.instances.length - 1;
  var instance = Instances.findOne(event.instances[instanceIndex]);
  var gameIDs = [];
  if(instance.brackets) {
    gameIDs = instance.brackets.map(bracket => {
      return bracket.game;
    })
  }
  Games.find({_id: { $in: gameIDs }}).forEach(game => {
    banners.push(game.banner);
  })
  return [
    Events.find({_id}),
    Images.find({
      _id: {
        $in: banners
      }
    }).cursor,
    Instances.find({ _id: event.instances[instanceIndex] }),
    Games.find({_id: { $in: gameIDs }})
  ];
});
