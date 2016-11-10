import Games from "/imports/api/games/games.js";
import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.brackets.add"(id, gameId, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event!");
    }
    var game = Games.findOne(gameId);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
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
    if(instance.tickets) {
      cmd["$set"] = {};
      cmd["$set"]["tickets." + instance.brackets.length + "f"] = {
        price: 0,
        description: ""
      }
    }
    Instances.update(instance._id, cmd);
  },
  "events.brackets.edit"(id, index, game, format) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Couldn't find event.");
    }
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!instance.brackets || !instance.brackets[index]) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.game`]: game,
        [`brackets.${index}.format`]: format
      }
    })
  },
  "events.brackets.remove"(id, index) {
    var event = Events.findOne(id);
    var instance = Instances.findOne(event.instance[event.instances.length - 1]);
    if(!instance) {
      throw new Meteor.Error(404, "Couldn't find event.");
    }
    if(!instance.brackets || !instance.brackets[index]) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    var cmd = {
      $pull: {
        "brackets": null
      }
    }
    if(instance.tickets) {
      if(instance.brackets.length > 1) {
        cmd["$set"] = {};
        for(var i = index; i <= instance.brackets.length - 1; i ++){
          cmd["$set"]["tickets." + i + "f"] = instance.tickets[(i + 1) + "f"];
        }
      }
    }
    Events.update(id, {
      $unset: {
        [`brackets.${index}`]: 1
      }
    });
    Events.update(id, cmd);
    if(instance.tickets) {
      Events.update(id, {
        $unset: {
          [`tickets.${(instance.brackets.length - 1) + "f"}`]: 1
        }
      });
    }
  }
})
