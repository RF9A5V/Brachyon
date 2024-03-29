import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

import { bracketHashGenerator } from "/imports/decorators/gen_bracket_hash.js";

Meteor.methods({
  "brackets.create"(obj) {
    var game = Games.findOne(obj.game);
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "Can't create bracket while not logged in!");
    }
    if(!game) {
      if (obj.gameName == null)
        throw new Meteor.Error(404, "Game not found!");
      var names = obj.gameName;
      var game = Games.findOne({
        name: names
      });
      if(!game) {
        game = Games.insert({
          name: names,
          description: "description",
          approved: true,
          bannerUrl:null,
          temp:true
        })
      }
      else {
        game = game._id;
      }
    }
    else {
      game = game._id;
    }
    var brackets = [
      {
        game: obj.game,
        format: obj.format,
        name: obj.name,
        slug: Meteor.call("brackets.generateHash", obj.slug || Games.findOne(game).slug)
      }
    ];
    if (obj.format.baseFormat == "swiss" || obj.format.baseFormat == "round_robin")
    {
      brackets.forEach( (bracket) => {bracket.score = {wins: 3, loss: 0, byes: 3, ties: 1}} );
    }
    Instances.insert({
      brackets,
      owner: Meteor.userId(),
      date: new Date()
    });
    return brackets[0].slug;
  }
})
