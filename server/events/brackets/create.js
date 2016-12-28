import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "brackets.create"(gameId, format) {
    var game = Games.findOne(gameId);
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    return Instances.insert({
      brackets: [
        {
          game: gameId,
          format
        }
      ]
    });
  }
})
