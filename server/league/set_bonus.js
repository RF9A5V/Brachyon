import Leagues from "/imports/api/leagues/league.js";

Meteor.methods({
  "leagues.leaderboard.setBonus"(id, index, userId, points) {
    var league = Leagues.findOne(id);
    if(!league) {
      throw new Meteor.Error(404, "League not found!");
    }

    var localIndex = league.leaderboard[index].findIndex(obj => {
      return obj.id == userId
    });
    var globalIndex = league.leaderboard[0].findIndex(obj => {
      return obj.id == userId
    });
    if(globalIndex < 0 || localIndex < 0) {
      throw new Meteor.Error(404, "User not found!");
    }

    var currentBonus = league.leaderboard[index][localIndex].bonus;
    var diff = points - currentBonus;

    Leagues.update(id, {
      $set: {
        [`leaderboard.${index}.${localIndex}.bonus`]: points
      },
      $inc: {
        [`leaderboard.0.${globalIndex}.bonus`]: diff
      }
    });
  }
})
