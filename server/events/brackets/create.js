import Games from "/imports/api/games/games.js";
import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "brackets.create"(url, obj) {
    var game = Games.findOne(obj.game);
    if(!Meteor.userId()) {
      throw new Meteor.Error(403, "Can't create bracket while not logged in!");
    }
    if(!game) {
      if (obj.gameName == null)
        throw new Meteor.Error(404, "Game not found!");
      var names = obj.gameName;
      if (Games.findOne({name:names})){
        game = Games.findOne({name:names});
      }
      else{
        Games.insert({
        name: names,
        description: "description",
        approved: true,
        bannerUrl:"/images/bg.jpg",
        temp:true
      })
      game = Games.findOne({name:names});
      }
    }
    var brackets = [{game: obj.game, format: obj.format, name: obj.name}];
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
