import Games from "/imports/api/games/games.js";
import { Images } from "/imports/api/event/images.js";

Meteor.publish("unapprovedGames", () => {
  var games = Games.find({ approved: false });
  var images = Images.find({ _id: { $in: games.map((g) => { return g.banner }) } })
  return [
    games, images.cursor
  ]
})
