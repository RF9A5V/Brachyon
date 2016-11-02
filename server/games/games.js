import Games from "/imports/api/games/games.js";
import Tags from "/imports/api/meta/tags.js";

Meteor.methods({
  "games.submitForReview"(name, description, imgID) {
    if(!name) {
      throw new Meteor.Error(403, "Can't create game with no name!");
    }
    if(!imgID) {
      throw new Meteor.Error(403, "Can't create game with no banner!");
    }
    Games.insert({
      name,
      banner: imgID,
      description,
      approved: false
    })
  },
  "games.addTag"(gameID, tag) {
    var tagTest = Tags.findOne(tag);
    if(!tagTest) {
      throw new Meteor.Error(403, "Tag doesn't exist!");
    }
    var game = Games.findOne(gameID);
    if(game.tags && game.tags.indexOf(tag) >= 0) {
      return;
    }
    Games.update(gameID, {
      $push: {
        tags: tag
      }
    });
    Tags.update(tag, {
      $push: {
        games: gameID
      }
    });
  },
  "games.removeTag"(gameID, tag) {
    Games.update(gameID, {
      $pull: {
        tags: tag
      }
    });
    Tags.update(tag, {
      $pull: {
        games: gameID
      }
    });
  }
})
