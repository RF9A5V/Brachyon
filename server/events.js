import OrganizeSuite from "./tournament_api.js";

Meteor.methods({

  "events.addParticipant"(eventID, bracketIndex, userID, alias, email) {
    var event = Events.findOne(eventID);

    if(alias == "" || alias == null) {
      throw new Meteor.Error(403, "Alias for a participant has to exist.");
    }
    if(event == null) {
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(event.brackets == null || event.brackets[bracketIndex] == null) {
      throw new Meteor.Error(404, "Couldn't find this bracket.");
    }
    var bracket = event.brackets[bracketIndex];

    var bracketContainsAlias = (bracket.participants || []).some((player) => {
      return player.alias.toLowerCase() == alias.toLowerCase();
    });

    if(bracketContainsAlias) {
      throw new Meteor.Error(403, "Someone is already using this alias. Choose another one.");
    }
    if(userID != null) {
      // User participant being added.
      var user = Meteor.users.findOne(userID);
      if(user == null) {
        throw new Meteor.Error(404, "User not found.");
      }
      var bracketContainsUser = (bracket.participants || []).some((player) => {
        return player.id == userID;
      });
      if(bracketContainsUser) {
        throw new Meteor.Error(403, "User is already registered for this bracket.");
      }
      var emailMatch = user.emails.some((emailObj) => {
        return emailObj.address == email;
      })
      if(!emailMatch) {
        throw new Meteor.Error(403, "Invalid email for verification.");
      }
    }
    Events.update(eventID, {
      $push: {
        [`brackets.${bracketIndex}.participants`]: {
          id: userID,
          alias
        }
      }
    })
  },

  "events.removeParticipant"(eventID, bracketIndex, participantIndex) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bracket = event.brackets[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    if(bracket.participants == null || bracket.participants.length <= participantIndex) {
      throw new Meteor.Error(404, "Participant not found.");
    }
    Events.update(eventID, {
      $unset: {
        [`brackets.${bracketIndex}.participants.${participantIndex}`]: 1
      }
    });
    Events.update(eventID, {
      $pull: {
        [`brackets.${bracketIndex}.participants`]: null
      }
    })
  },

  "events.registerUser"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bracket = event.brackets[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    var user = Meteor.user();
    var alias = user.profile.alias || user.username;
    var bracketContainsUser = (bracket.participants || []).some((player) => {
      return player.id == user._id;
    });
    if(bracketContainsUser) {
      throw new Meteor.Error(403, "User is already registered for this bracket.");
    }
    var bracketContainsAlias = (bracket.participants || []).some((player) => {
      return player.alias.toLowerCase() == alias.toLowerCase();
    });
    if(bracketContainsAlias) {
      throw new Meteor.Error(403, "Someone is already using this alias. Choose another one or talk to your friendly neighborhood tournament organizer.");
    }
    Events.update(eventID, {
      $push: {
        [`brackets.${bracketIndex}.participants`]: {
          id: user._id,
          alias
        }
      }
    })
  },

  "events.start_event"(eventID, index) {
    if(Events.findOne(eventID) == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var organize = Events.findOne(eventID).brackets[index];
    var format = Events.findOne(eventID).brackets[index].format.baseFormat;
    if (format == "single_elim")
      var rounds = OrganizeSuite.singleElim(organize.participants.map(function(participant) {
        return participant.alias;
      }));
    else if (format == "double_elim")
      var rounds = OrganizeSuite.doubleElim(organize.participants.map(function(participant) {
        return participant.alias;
      }));
    else if (format == "swiss")
      var rounds = OrganizeSuite.swiss(organize.participants.map(function(participant) {
        return participant.alias;
      }));

    Events.update(eventID, {
      $set: {
        [`brackets.${index}.inProgress`]: true,
        [`brackets.${index}.rounds`]: rounds
      }
    })
  },

  "events.advance_match"(eventID, bracketNumber, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.brackets[0];
    var loser;
    var match = event.rounds[bracketNumber][roundNumber][matchNumber];
    if (match.winner != null || match.playerOne == null || match.playerTwo == null)
      return false;
    if(placement == 0) {
      match.winner = match.playerOne;
      loser = match.playerTwo;
    }
    else {
      match.winner = match.playerTwo;
      loser = match.playerOne;
    }

    if (bracketNumber == 0 && match.losm != null)
    {
      var losMatch = event.rounds[1][match.losr][match.losm];
      if (losMatch.playerOne == null) losMatch.playerOne = loser;
      else losMatch.playerTwo = loser;
      var losr = match.losr, losm = match.losm;
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${1}.${losr}.${losm}`]: losMatch
        }
      })
    }

    if((roundNumber + 1 >= event.rounds[bracketNumber].length && event.rounds.length == 1) || (bracketNumber == 2 && (match.playerOne == match.winner || (roundNumber == 1)))){
      if (event.rounds.length == 1 || bracketNumber == 2)
      {
        Events.update(eventID, {
          $set: {
            [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
            complete: true
          }
        })
      }
    }

    else if (roundNumber + 1 >= event.rounds[bracketNumber].length){
      advMatch = event.rounds[2][0][0];
      if (bracketNumber == 0) advMatch.playerOne = match.winner;
      else advMatch.playerTwo = match.winner;
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`brackets.0.rounds.${2}.${0}.${0}`]: advMatch
        }
      })
    }

    else {
      var advMN = (bracketNumber > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
      var advMatch = event.rounds[bracketNumber][roundNumber + 1][advMN];
      if (bracketNumber == 0 || roundNumber%2 == 1)
      {
        if(matchNumber % 2 == 0){
          advMatch.playerOne = match.winner;
        }
        else {
          advMatch.playerTwo = match.winner;
        }
      }
      else if (bracketNumber == 2)
      {
        advMatch.playerOne = match.playerOne;
        advMatch.playerTwo = match.playerTwo;
      }
      else
      {
        advMatch.playerTwo = match.winner;
      }
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`brackets.0.rounds.${bracketNumber}.${roundNumber + 1}.${advMN}`]: advMatch
        }
      })
    }
  },

  "events.undo_match"(eventID, bracketNumber, roundNumber, matchNumber) {
    var event = Events.findOne(eventID);
    if (!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.brackets[0];
    match = event.rounds[bracketNumber][roundNumber][matchNumber];
    var advMN = (bracketNumber > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
    var [fb, fr, fm] = [bracketNumber, roundNumber+1, advMN];
    if (fr >= event.rounds[bracketNumber].length)
      var [fb, fr, fm] = bracketNumber == 2 ? [2, 1, 0]:[2, 0, 0];
    if ((bracketNumber == 2 && roundNumber == 1) || (event.rounds.length < 2 && roundNumber >= event.rounds[0].length-1))
    {
      match.winner = null;
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${0}`]: match
        }
      });
      return;
    }
    var advMatch = event.rounds[fb][fr][fm];

    //Call the function recursively on the ahead losers and update the matches
    if (advMatch.winner)
    {
      Meteor.call("events.undo_match", eventID, fb, fr, fm);
      event = Events.findOne(eventID).brackets[0];
      advMatch = event.rounds[fb][fr][fm];
      match = event.rounds[bracketNumber][roundNumber][matchNumber];
    }

    //This is the function to undo loser bracket placement
    if (event.rounds.length > 1 && bracketNumber == 0)
    {
      loser = match.winner == match.playerOne ? (match.playerTwo):(match.playerOne);
      loserround = event.rounds[1][match.losr][match.losm];
      if (loserround.winner != null)
      {
        Meteor.call("events.undo_match", eventID, 1, match.losr, match.losm);
        event = Events.findOne(eventID).brackets[0];
        advMatch = event.rounds[fb][fr][fm];
        match = event.rounds[bracketNumber][roundNumber][matchNumber];
        loserround = event.rounds[1][match.losr][match.losm];
      }
      if (loserround.playerOne == loser) loserround.playerOne = null;
      else loserround.playerTwo = null;
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${1}.${match.losr}.${match.losm}`]: loserround
        }
      });
    }
    match.winner = null;

    //Depending on the bracket is how the winner will be sent.
    if (roundNumber >= event.rounds[bracketNumber].length-1)
    {
      if (bracketNumber == 0)
        advMatch.playerOne = null;
      else
        advMatch.playerTwo = null;
    }
    else if (bracketNumber == 0 || roundNumber%2 == 1)
    {
      if(matchNumber % 2 == 0){
        advMatch.playerOne = null;
      }
      else {
        advMatch.playerTwo = null;
      }
    }
    else if (bracketNumber == 2)
    {
      advMatch.playerOne = null;
      advMatch.playerTwo = null;
    }
    else
    {
      advMatch.playerTwo = null;
    }

    //Update the round
    Events.update(eventID, {
      $set: {
        [`brackets.0.rounds.${fb}.${fr}.${fm}`]: advMatch,
        [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match
      }
    })
    //Return for recursion
    return;
  },

  "events.update_match"(eventID, roundNumber, matchNumber, score, placement)
  {
    var event = Events.findOne(eventID);
    event = event.brackets[0].rounds[roundNumber];
    var p1 = event.matches[matchNumber].playerOne;
    var p2 = event.matches[matchNumber].playerTwo;
    if (placement == 0)
    {
      p1 = event.matches[matchNumber].playerOne;
      p2 = event.matches[matchNumber].playerTwo;
      event.matches[matchNumber].winner = event.matches[matchNumber].playerOne;
    }
    else
    {
      p2 = event.matches[matchNumber].playerOne;
      p1 = event.matches[matchNumber].playerTwo;
      event.matches[matchNumber].winner = event.matches[matchNumber].playerTwo;
    }
    var p1num, p2num;
    for (var x = 0; x < event.players.length; x++)
    {
      if (event.players[x].name == p1)
      {
        event.players[x].score += score;
        console.log("x: " + x + " score " + score)
        event.players[x].wins++;
        p1num = x;
        event.players[x].playedagainst[p2] = true;
      }
      if (event.players[x].name == p2)
      {
        p2num = x;
        event.players[x].losses++;
        event.players[x].playedagainst[p1] = true;
      }
    }
    console.log(event.players[p1num] + " " + event.players[p2num]);
    Events.update(eventID, {
      $set: {
        [`brackets.0.rounds.${roundNumber}`]: event
      }
    })
  },

  "events.tiebreaker"(eventID, roundNumber, matchNumber, score)
  {
    var event = Events.findOne(eventID);
    event = event.brackets[0].rounds[roundNumber];
    var p1 = event.matches[matchNumber].playerOne;
    var p2 = event.matches[matchNumber].playerTwo;
    var bnum1 = 0;
    var bnum2 = 0;
    for (var x = 0; x < event.players.length; x++)
    {
      if (event.players[x].name == p1)
      {
        for (var y = 0; y < event.players[x].length; y++)
        {
          var name = event.players[y].name;
          if (event.players[x].playedagainst[name] = true)
            bnum1 += event.players[y].score;
        }
      }
      if (event.players[x].name == p2)
      {
        for (var y = 0; y < event.players[x].length; y++)
        {
          var name = event.players[y].name;
          if (event.players[x].playedagainst[name] = true)
            bnum2 += event.players[y].score;
        }
      }
      if (bnum1 > bnum2)
      {
        //Insert p1 is winner
      }
      else if (bnum2 > bnum1)
      {
        //Insert p2 is winner
      }
      else
      {
        //I don't fucking know is this even possible make them play again ffs
      }
    }
  },

  "events.update_round"(eventID, roundNumber) { //For swiss specifically
    var event = Events.findOne(eventID);
    event = event.brackets[0].rounds[roundNumber];
    var players = event.players;
    var key = 'score';
    var scores = [];
    var max = 0;

    for (var x = 0; x < players.length; x++)
    {
      scores[players[x].score].push(players[x]);
      if (players[x].score > max)
        max = players[x].score;
    }
    console.log(scores);
    var extraplayer = -1;
    var values = [];
    for (var x = max; x >= 0; x--) //Form them into subarrays
    {
      if (typeof scores[x] !== 'undefined') {
        if (extraplayer != -1)
        {
          scores[x].unshift(extraplayer);
          extraplayer = -1;
        }
        if (scores[x].length%2 == 1)
          extraplayer = scores[x].pop;
        values.push(x);
      }
    }
    console.log(scores);
    if (extraplayer != -1) //We obviously can't do this either since it may place someone who had a bool again, this is a temporary system. Idea: Don't shift out people with byes, still flawed.
    {
      extraplayer.wins++;
      extraplayer.bool = true;
    }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    for (var x = 0; x < values.length; x++)
    {
      var y = values[x];
      for (var z = 0; z = scores[y].length/2; z++)
      {
        var opponent = scores[y][z+scores[y].length/2].name;
        if (scores[y][z].playerarr[opponent] = true)
        {
          if (scores[y].length > 2)
          {
            scores[y] = shuffle(scores[y]);
            z--;
          }
          else if (x == values.length-1) {
            scores[values[x-1]].concat(scores.pop());
            x--;
            break;
          }
          else
          {
            scores[values[x]].concat(scores[values[x+1]]);
            scores.splice(values[x+1], 1);
            z = -1;
          }
        }
      }
    }

    var temp = [];
    
    for (var x = 0; x < values.length; x++) //TODO: Check if two players who played against each other might end up doing so again.
    {
      var y = values[x]; //Our actual index value. Since the value is sorted backwards this goes top down.
      for (var z = 0; z = scores[y].length/2; z++)
      {
        var opponent = scores[y][z].name;
        var matchObj = {
          playerOne: scores[y][z].name,
          playerTwo: scores[y][z+scores[y].length/2].name,
          winner: null
        }
        temp.push(matchObj);
      }
      event.matches.push(temp);
    }
      Events.update(eventID, {
        $set: {
          [`brackets.0.rounds.${roundNumber+1}`]: event
        }
      })
    }

})
