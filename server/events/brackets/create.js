import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "brackets.create"(url, obj) {
    var brackets = [{game: obj.game, format: obj.format, name: obj.name}];
    var game = Games.findOne(obj.game);
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "Can't create bracket while not logged in!");
    }
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    if (obj.format.baseFormat == "swiss" || obj.format.baseFormat == "round_robin")
    {
      brackets.forEach( (bracket) => {bracket.score = {wins: 3, loss: 0, byes: 3, ties: 1}} );
    }
    Instances.insert({
      brackets,
      owner: Meteor.userId(),
      date: new Date(),
      slug: url
    });
    return url;
  }
})
