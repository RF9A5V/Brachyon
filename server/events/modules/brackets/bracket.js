import Games from "/imports/api/games/games.js";

Meteor.methods({
  "events.brackets.add"(id, name, gameId, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event!");
    }
    var game = Games.findOne(gameId);
    if(!game) {
      throw new Meteor.Error(404, "Couldn't find game!");
    }
    if(!name || name.length < 3) {
      throw new Meteor.Error(403, "Name needs to be longer than 3 chars.");
    }
    Events.update(id, {
      $push: {
        "brackets": {
          name,
          game: gameId,
          format
        }
      }
    })
  },
  "events.brackets.edit"(id, index, name, game, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event.");
    }
    if(!event.brackets || !event.brackets[index]) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    Events.update(id, {
      $set: {
        [`brackets.${index}.name`]: name,
        [`brackets.${index}.game`]: game,
        [`brackets.${index}.format`]: format
      }
    })
  }
})
