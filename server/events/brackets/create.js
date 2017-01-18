import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "brackets.create"(gameId, format, name) {
    var game = Games.findOne(gameId);
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "Can't create bracket while not logged in!");
    }
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    return Instances.insert({
      brackets: [
        {
          game: gameId,
          format,
          name
        }
      ],
      owner: Meteor.userId(),
      date: new Date()
    });
  }
})
