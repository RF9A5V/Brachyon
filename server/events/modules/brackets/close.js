import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.brackets.close"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(!event) {
      throw new Meteor.Error(404, "Event not found!");
    }
    var bracket = instance.brackets[bracketIndex];
    if(!bracket) {
      throw new Meteor.Error(404, "Bracket not found!");
    }
    if(!bracket.format.baseFormat) {
      throw new Meteor.Error(500, "Completion for bracket with pools or groups not implemented yet!");
    }
    var ldrboard = {};
    var userCount = 1;
    var roundobj = Brackets.findOne(bracket.id);
    if(bracket.format.baseFormat == "single_elim") {
      var finals = roundobj.rounds[roundobj.rounds.length - 1].pop()[0];
      if(finals.winner == null) {
        throw new Meteor.Error(403, "Cannot end bracket while matches are unplayed!");
      }
      roundobj.rounds[roundobj.rounds.length - 1].push([finals]);
      var singleElimBracket = roundobj.rounds[roundobj.rounds.length - 1];
      singleElimBracket.reverse().forEach(round => {
        round.forEach(match => {
          if(ldrboard[match.winner] == null) {
            ldrboard[match.winner] = userCount ++;
          }
          var loser = match.winner == match.playerOne ? match.playerTwo : match.playerOne;
          if(ldrboard[loser] == null) {
            ldrboard[loser] = userCount ++;
          }
        });
      });
    }
    else if(bracket.format.baseFormat == "double_elim") {
      // Check to see if bracket has played to completion.
      var finalSet = roundobj.rounds[roundobj.rounds.length - 1];
      var finalOne = finalSet[0][0];
      var finalTwo = finalSet[1][0];
      // If the first match has a winner and nobody is playing in the second match, the bracket is decided.
      // If the second match has a winner, the bracket is decided.
      if((finalOne.winner && !finalTwo.playerOne) || finalTwo.winner) {
        // Generate leaderboard
        var losersBracket = roundobj.rounds[1];
        losersBracket = losersBracket.concat(finalSet).reverse();
        losersBracket.forEach(round => {
          round.forEach(match => {
            if(match.winner == null) {
              return;
            }
            if(ldrboard[match.winner] == null) {
              ldrboard[match.winner] = userCount ++;
            }
            var loser = match.winner == match.playerOne ? match.playerTwo : match.playerOne;
            if(ldrboard[loser] == null) {
              ldrboard[loser] = userCount ++;
            }
          })
        });
      }
      else {
        throw new Meteor.Error(403, "Cannot end bracket while matches are unplayed!");
      }
    }
    var cmd = {
      $set: {}
    };
    var participants = bracket.participants;
    participants.forEach((p, index) => {
      var placement = ldrboard[p.alias];
      cmd["$set"][`brackets.${bracketIndex}.participants.${index}.placement`] = placement;
    });
    cmd["$set"][`brackets.${bracketIndex}.isComplete`] = true;
    cmd["$set"][`brackets.${bracketIndex}.inProgress`] = false;
    cmd["$set"][`brackets.${bracketIndex}.endedAt`] = new Date();

    // League update
    if(event.league) {
      var updateObj = {};
      var league = Leagues.findOne(event.league);
      var totalScore = participants.length;

      var leaderboardIndex = league.events.indexOf(event.slug) + 1;
      league.leaderboard[leaderboardIndex].forEach((obj, localIndex) => {
        var user = Meteor.users.findOne(obj.id);
        var globalIndex = league.leaderboard[0].findIndex((usr) => { return usr.id == obj.id });
        var scoreNeg = 0;
        if(bracket.format.baseFormat == "single_elim") {
          scoreNeg = parseInt(Math.log2(ldrboard[user.username]));
        }
        else if(bracket.format.baseFormat == "double_elim") {
          var scoreNeg = ldrboard[user.username];
          if(scoreNeg > 4) {
            scoreNeg = parseInt(Math.log2(scoreNeg)) + 3
          }
        }
        else {
          scoreNeg = ldrboard[user.username];
        }
        updateObj[`leaderboard.0.${globalIndex}.score`] = totalScore - scoreNeg;
        updateObj[`leaderboard.${leaderboardIndex}.${localIndex}.score`] = totalScore - scoreNeg;
      });
      Leagues.update(event.league, {
        $inc: updateObj
      });
    }

    Instances.update(instance._id, cmd);
  }
})
