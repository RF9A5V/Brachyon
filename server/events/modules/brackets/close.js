import Instances from "/imports/api/event/instance.js";

Meteor.methods({
  "events.brackets.close"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    var instance;
    if(!event) {
      instance = Instances.findOne(eventID);
    }
    else {
      var instance = Instances.findOne(event.instances.pop());
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

      var players = {};
      instance.brackets[bracketIndex].participants.forEach(participant=>{players[participant.alias]={id:participant.id, losses:1, wins:0, ties:0}});
      var round=roundobj.rounds;
      for (i=0; i<round[0].length; i++){
        for(j=0; j<round[0][i].length ; j++){
          var match = round[0][i][j];
          if(match.winner != null){
            if(players[match.playerOne]){
              players[match.playerOne].wins = players[match.playerOne].wins ? players[match.playerOne].wins + 1 : 1;
            }
            if(players[match.playerTwo]){
              players[match.playerTwo].wins = players[match.playerTwo].wins ? players[match.playerTwo].wins + 1 : 1;
            }
          }
        }
      }
      var finalWinner = round[0][round.length - 1].pop().winner;
      if(players[finalWinner] != null){
        players[finalWinner].wins += 1;
        players[finalWinner].losses = 0;
      }

      Object.keys(players).forEach(p => { players[p].wins -= 1 });

      Object.keys(players).forEach(player=>{
        var scoreObject = players[player];
        var updateObject = {
          [`stats.${bracket.game}.wins`]: scoreObject.wins,
          [`stats.${bracket.game}.losses`]: scoreObject.losses,
          [`stats.${bracket.game}.ties`]: scoreObject.ties
        };
        Meteor.users.update(scoreObject.id,{$inc:updateObject});
      })  

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


        
        var players = {};
        instance.brackets[bracketIndex].participants.forEach(participant=>{players[participant.alias]={id:participant.id, losses:2, wins:0, ties:0}});
        var round=roundobj.rounds;
        //give points for winners bracket
        for (i=0; i<round[0].length; i++){
          for(j=0; j<round[0][i].length ; j++){
            var match = round[0][i][j];
            if(match.winner != null){
              if(players[match.playerOne]){
                players[match.playerOne].wins = players[match.playerOne].wins ? players[match.playerOne].wins + 1 : 1;
              }
              if(players[match.playerTwo]){
                players[match.playerTwo].wins = players[match.playerTwo].wins ? players[match.playerTwo].wins + 1 : 1;
              }
            }
          }
        }
        //give points for losers bracket
        for (i=0; i<round[1].length; i++){
          for(j=0; j<round[1][i].length ; j++){
            var match = round[1][i][j];
            if(match.winner != null){
              if(players[match.playerOne]){
                players[match.playerOne].wins = players[match.playerOne].wins ? players[match.playerOne].wins + 1 : 1;
              }
              if(players[match.playerTwo]){
                players[match.playerTwo].wins = players[match.playerTwo].wins ? players[match.playerTwo].wins + 1 : 1;
              }
            }
          }
        }

        var finalSet = roundobj.rounds[roundobj.rounds.length - 1];
        var finalOne = finalSet[0][0];
        var finalTwo = finalSet[1][0];

        // If the first match has a winner and nobody is playing in the second match, the bracket is decided.
        // If the second match has a winner, the bracket is decided.

        if(finalOne.winner && !finalTwo.playerOne) {
          //if grandFinals and no reset
          players[finalOne.winner].wins = players[finalOne.winner].wins ? players[finalOne.winner].wins + 1 : 1;
          players[finalOne.winner].losses = players[finalOne.winner].losses ? players[finalOne.winner].losses -2 : 1 ;

        }
        if (finalTwo.playerOne){
          if (players[finalTwo.winner] == players[finalTwo.playerOne]){
            players[finalTwo.playerOne].wins = players[finalTwo.playerOne].wins ? players[finalTwo.playerOne].wins + 2 : 1;
            players[finalTwo.playerOne].losses = players[finalTwo.playerOne].losses ? players[finalTwo.playerOne].losses - 1 : 1;
            players[finalTwo.playerTwo].wins = players[finalTwo.playerTwo].wins ? players[finalTwo.playerTwo].wins + 1 : 1;
          }
          else{
            players[finalTwo.playerTwo].wins = players[finalTwo.playerTwo].wins ? players[finalTwo.playerTwo].wins + 2 : 1;
            players[finalTwo.playerTwo].losses = players[finalTwo.playerTwo].losses ? players[finalTwo.playerTwo].losses - 1 : 1;
            players[finalTwo.playerOne].wins = players[finalTwo.playerOne].wins ? players[finalTwo.playerOne].wins + 1 : 1;
          }
        }
        

        Object.keys(players).forEach(p => { players[p].wins -= 1 });

        Object.keys(players).forEach(player=>{
        var scoreObject = players[player];
        var updateObject = {
          [`stats.${bracket.game}.wins`]: scoreObject.wins,
          [`stats.${bracket.game}.losses`]: scoreObject.losses,
          [`stats.${bracket.game}.ties`]: scoreObject.ties
        };
        Meteor.users.update(scoreObject.id,{$inc:updateObject});
      })



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
    if(event && event.league) {
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













