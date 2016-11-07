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
  var image = GameBanners.find({ _id: game.banner })
  return [
    Games.find({slug}),
    image.cursor
  ]
})
