import Games from "/imports/api/games/games.js";

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
  }
})
