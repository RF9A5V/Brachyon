import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "brackets.create"(gameId, format, name) {
    var brackets = [{game: gameId, format: format, name: name}];
    var game = Games.findOne(gameId);
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "Can't create bracket while not logged in!");
    }
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    if (format.baseFormat == "swiss" || format.baseFormat == "round_robin")
    {
      var score = {};
      score.wins = 3;
      score.loss = 0;
      score.byes = 3;
      score.ties = 1;
      brackets[0].score = score;
    }
    return Instances.insert({
      brackets,
      owner: Meteor.userId(),
      date: new Date()
    });
  }
})
