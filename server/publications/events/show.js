import Games from '/imports/api/games/games.js';
import { Images } from "/imports/api/event/images.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Icons } from "/imports/api/sponsorship/icon.js";

Meteor.publish('event', (_id) => {
  var event = Events.findOne(_id);
  var sponsors = [];
  if(event.revenue && event.revenue.sponsors){
    sponsors = event.revenue.sponsors.map((sponsor) => {
      return sponsor.id;
    })
  }
  var participants = new Set();
  if(event.brackets) {
    event.brackets.forEach((bracket) => {
      if(!bracket) {
        return;
      }
      (bracket.participants || []).forEach((player) => {
        if(player.id){
          participants.add(player.id);
        }
      })
    })
  }
  sponsors.forEach((spons) => {
    participants.add(spons);
  });
  var users = Meteor.users.find({_id: { $in: Array.from(participants) }})
  var profileImages = ProfileImages.find({_id: { $in: (users.map( (user) => { return user.profile.image } )) }});
  var gameIds = [];
  var banners = [event.details.banner];
  var iconIDs = [];
  if(event.brackets) {
    event.brackets.forEach((bracket) => {
      if(!bracket){
        return;
      }
      gameIds.push(bracket.game);
    })
  }
  var games = Games.find({_id: { $in: gameIds }});
  banners = banners.concat(games.map((game) => { return game.banner }));
  return [
    Events.find({_id}),
    Images.find({
      _id: {
        $in: banners
      }
    }).cursor,
    users,
    profileImages.cursor,
    games,
    Icons.find({
      _id: {
        $in: iconIDs
      }
    }).cursor
  ];
});
