import moment from "moment";

import Games from "/imports/api/games/games.js";
import { GameBanners } from "/imports/api/games/game_banner.js";

Meteor.publish('games', function(){
  var games = Games.find({approved: true}).fetch().map(function(game) { return game.banner });
  return [
    Games.find({approved: true}),
    GameBanners.find({_id: { $in: games }}).cursor
  ]
})

Meteor.publish('game_search', function(query) {
  if(query == ""){
    return [];
  }
  var games = Games.find({
    name: new RegExp(`^${query}[.]*`, "i"),
    approved: true
  });
  var banners = games.map(function(game) { return game.banner });
  return [
    games,
    GameBanners.find({_id: { $in: banners }}).cursor
  ]
})

Meteor.publish("unapprovedGames", () => {
  var games = Games.find({ approved: false });
  var images = GameBanners.find({ _id: { $in: games.map((g) => { return g.banner }) } })
  return [
    games, images.cursor
  ]
})

Meteor.publish("game", (slug) => {
  var game = Games.findOne({slug});
  return [
    Games.find({slug})
  ]
})

Meteor.publish("gamehub", (slug) => {
  var g = Games.findOne({ slug });
  var allInstances = Events.find({ isComplete: false, "details.datetime": { $gte: new Date(), $lte: moment().add(30, "days").toDate() } }).map(e => { return e.instances.pop() });
  var instances = Instances.find({ _id: { $in: allInstances }, "brackets": { $elemMatch: { game: g._id } } });
  var events = Events.find({ instances: { $in: instances.map(i => {return i._id}) } });
  var users = Meteor.users.find({ _id: { $in: events.map(e => { return e.owner }) } }, { username: 1, "profile.imageUrl": 1 });
  return [
    Games.find({ slug }),
    instances,
    events,
    users
  ]
})
