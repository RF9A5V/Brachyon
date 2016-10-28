import Games from "/imports/api/games/games.js";

Meteor.methods({
  "events.brackets.add"(id, gameId, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event!");
    }
    var game = Games.findOne(gameId);
    if(!game) {
      throw new Meteor.Error(404, "Couldn't find game!");
    }
    var cmd = {
      $push: {
        "brackets": {
          game: gameId,
          format
        }
      }
    }
    if(event.tickets) {
      cmd["$set"] = {};
      cmd["$set"]["tickets." + event.brackets.length + "f"] = {
        price: 0,
        description: ""
      }
    }
    Events.update(id, cmd);
  },
  "events.brackets.edit"(id, index, game, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event.");
    }
    if(!event.brackets || !event.brackets[index]) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    Events.update(id, {
      $set: {
        [`brackets.${index}.game`]: game,
        [`brackets.${index}.format`]: format
      }
    })
  },
  "events.brackets.remove"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event.");
    }
    if(!event.brackets || !event.brackets[index]) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    var cmd = {
      $pull: {
        "brackets": null
      }
    }
    if(event.tickets) {
      if(event.brackets.length > 1) {
        cmd["$set"] = {};
        for(var i = index; i <= event.brackets.length - 1; i ++){
          cmd["$set"]["tickets." + i + "f"] = event.tickets[(i + 1) + "f"];
        }
      }
    }
    Events.update(id, {
      $unset: {
        [`brackets.${index}`]: 1
      }
    });
    Events.update(id, cmd);
    if(event.tickets) {
      Events.update(id, {
        $unset: {
          [`tickets.${(event.brackets.length - 1) + "f"}`]: 1
        }
      });
    }
  }
})
