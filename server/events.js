import OrganizeSuite from "./tournament_api.js";
import Notifications from "/imports/api/users/notifications.js";

import Instances from "/imports/api/event/instance.js";

Meteor.methods({

  "events.addParticipant"(eventID, bracketIndex, userID, alias) {
    var event = Events.findOne(eventID);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if(userID) {
      alias = Meteor.users.findOne(userID).username;
    }
    //console.log(alias);
    if(alias == "" || alias == null) {
      throw new Meteor.Error(403, "Alias for a participant has to exist.");
    }
    if(event == null) {
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(instance.brackets == null || instance.brackets[bracketIndex] == null) {
      throw new Meteor.Error(404, "Couldn't find this bracket.");
    }
    var bracket = instance.brackets[bracketIndex];

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
      var note = Notifications.findOne({ type: "eventInvite", event: event._id, recipient: userID });
      if(note) {
        throw new Meteor.Error(403, "Notification already sent!");
      }
      else {
        var owner = Meteor.users.findOne(event.owner);
        Notifications.insert({
          type: "eventInvite",
          owner: owner.username,
          image: owner.profile.imageUrl,
          event: event.details.name,
          eventSlug: event.slug,
          alias,
          recipient: userID,
          seen: false
        });
      }
    }
    Instances.update(instance._id, {
      $push: {
        [`brackets.${bracketIndex}.participants`]: {
          id: userID,
          alias: alias
        }
      }
    })
  },

  "events.removeParticipant"(eventID, bracketIndex, userId) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bracket = event.brackets[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    Events.update(eventID, {
      $pull: {
        [`brackets.${bracketIndex}.participants`]: {
          id: userId
        }
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
    if(Notifications.findOne({ recipient: event.owner, eventSlug: event.slug, userId: user._id })) {
      throw new Meteor.Error(403, "You've already requested entry to this event.");
    }
    Notifications.insert({
      type: "eventRegistrationRequest",
      recipient: event.owner,
      image: user.profile.imageUrl,
      user: user.profile.alias || user.profile.username,
      userId: user._id,
      eventSlug: event.slug,
      event: event.details.name,
      read: false
    });
    // Events.update(eventID, {
    //   $push: {
    //     [`brackets.${bracketIndex}.participants`]: {
    //       id: user._id,
    //       alias
    //     }
    //   }
    // })
  },

  "events.start_event"(eventID, index) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var organize = instance.brackets[index];
    var format = instance.brackets[index].format.baseFormat;
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
    else
    var rounds = OrganizeSuite.roundRobin(organize.participants.map(function(participant) {
      return participant.alias;
    }));

    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.inProgress`]: true,
        [`brackets.${index}.rounds`]: rounds,
        [`brackets.${index}.startedAt`]: new Date()
      }
    })
  },

  "events.advance_match"(eventID, bracketNumber, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0];
    var loser;
    var match = bracket.rounds[bracketNumber][roundNumber][matchNumber];
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
      var losMatch = bracket.rounds[1][match.losr][match.losm];
      if (losMatch.playerOne == null) losMatch.playerOne = loser;
      else losMatch.playerTwo = loser;
      var losr = match.losr, losm = match.losm;
      Instances.update(instance._id, {
        $set: {
          [`brackets.0.rounds.${1}.${losr}.${losm}`]: losMatch
        }
      })
    }

    if((roundNumber + 1 >= bracket.rounds[bracketNumber].length && bracket.rounds.length == 1) || (bracketNumber == 2 && (match.playerOne == match.winner || (roundNumber == 1)))){
      if (bracket.rounds.length == 1 || bracketNumber == 2)
      {
        Instances.update(instance._id, {
          $set: {
            [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
            complete: true
          }
        })
      }
    }

    else if (roundNumber + 1 >= bracket.rounds[bracketNumber].length){
      advMatch = bracket.rounds[2][0][0];
      if (bracketNumber == 0) advMatch.playerOne = match.winner;
      else advMatch.playerTwo = match.winner;
      Instances.update(instance._id, {
        $set: {
          [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`brackets.0.rounds.${2}.${0}.${0}`]: advMatch
        }
      })
    }

    else {
      var advMN = (bracketNumber > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
      var advMatch = bracket.rounds[bracketNumber][roundNumber + 1][advMN];
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
      Instances.update(instance._id, {
        $set: {
          [`brackets.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`brackets.0.rounds.${bracketNumber}.${roundNumber + 1}.${advMN}`]: advMatch
        }
      })
    }
  },

  "events.place_winner"(eventID, bracketNumber, roundNumber, matchNumber){
    return;
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

  "events.update_match"(eventID, roundNumber, matchNumber, score, winfirst, winsecond, ties)
  {
    var event = Events.findOne(eventID);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    if (roundNumber > 0)
      var prevround = instance.brackets[0].rounds[roundNumber-1];
    var bracket = instance.brackets[0].rounds[roundNumber];
    bracket.matches[matchNumber].p1score = winfirst;
    bracket.matches[matchNumber].p2score = winsecond;
    bracket.matches[matchNumber].ties = ties;
    var p1 = bracket.matches[matchNumber].playerOne;
    var p2 = bracket.matches[matchNumber].playerTwo;
    var prevmatch1, prevmatch2;
    if (roundNumber < 1)
    {
      prevmatch1 = {score: 0, wins: 0, losses: 0};
      prevmatch2 = {score: 0, wins: 0, losses: 0};
    }
    else
    {
      for (var x = 0; x < bracket.players.length; x++) //TODO: Make the name a key to the player array so we don't have to do 2N worth of searches every update.
      {
        if (prevround.players[x].name == p1)
          prevmatch1 = prevround.players[x];
        if (prevround.players[x].name == p2)
          prevmatch2 = prevround.players[x];
      }
    }
    for (var x = 0; x < bracket.players.length; x++)
    {
      if (bracket.players[x].name == p1)
      {
        bracket.players[x].score = prevmatch1.score + score*winfirst;
        bracket.players[x].wins = prevmatch1.wins + winfirst;
        bracket.players[x].losses = prevmatch1.losses + winsecond;
        bracket.players[x].playedagainst[p2] = true;
      }
      if (bracket.players[x].name == p2)
      {
        bracket.players[x].score = prevmatch2.score + score*winsecond;
        bracket.players[x].wins = prevmatch2.wins + winsecond;
        bracket.players[x].losses = prevmatch2.losses + winfirst;
        bracket.players[x].playedagainst[p1] = true;
      }
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.0.rounds.${roundNumber}`]: bracket
      }
    })
  },

  "events.complete_match"(eventID, roundNumber, matchNumber) //Also used for round robin because of how stupidly simple this is of a function.
  {
    var event = Events.findOne(eventID);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0].rounds[roundNumber];
    instance.matches[matchNumber].played = true;
    Instances.update(instance._id, {
      $set: {
        [`brackets.0.rounds.${roundNumber}`]: bracket
      }
    })
  },

  "events.tiebreaker"(eventID, roundNumber, matchNumber, score)
  {
    var event = Events.findOne(eventID);
    var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    var bracket = instance.brackets[0].rounds[roundNumber];
    var p1 = bracket.matches[matchNumber].playerOne;
    var p2 = bracket.matches[matchNumber].playerTwo;
    var bnum1 = 0;
    var bnum2 = 0;
    for (var x = 0; x < bracket.players.length; x++)
    {
      if (bracket.players[x].name == p1)
      {
        for (var y = 0; y < bracket.players[x].length; y++)
        {
          var name = bracket.players[y].name;
          if (bracket.players[x].playedagainst[name] = true)
            bnum1 += bracket.players[y].score;
        }
      }
      if (bracket.players[x].name == p2)
      {
        for (var y = 0; y < bracket.players[x].length; y++)
        {
          var name = bracket.players[y].name;
          if (bracket.players[x].playedagainst[name] = true)
            bnum2 += bracket.players[y].score;
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
        //Next round mathafucka
      }
    }
  },

  "events.update_round"(eventID, roundNumber, score) { //For swiss specifically
    var event = Events.findOne(eventID);
    rounds = event.brackets[0].rounds;
    event = event.brackets[0].rounds[roundNumber];
    var players = event.players;
    var key = 'score';
    var scores = [];
    var max = 0;

    for (var x = 0; x < players.length; x++)
    {
      if (typeof scores[players[x].score] == 'undefined')
      {
        scores[players[x].score] = [];
      }
      scores[players[x].score].push(players[x]);
      if (players[x].score > max)
        max = players[x].score;
    }
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
        {
          extraplayer = scores[x].pop();
        }
        if (scores[x].length > 0)
          values.push(x);
      }
    }

    if (extraplayer != -1) //Flawed for one minor reason: bye may be answer to matching someone of the same score to avoid concating.
    {
      if (extraplayer.bye)
      {
        var foundbye = false;
        var y = values.length-1;
        while (!foundbye)
        {
          for (var x = 0; x < scores[values[y]].length; x++)
          {
            if (scores[values[y]][x].bye == false)
            {
              var swap = extraplayer;
              extraplayer = scores[values[y]][x];
              scores[values[y]][x] = swap;
              foundbye = true;
              break;
            }
          }
          y--;
        }
      }
      extraplayer.bye = true;
      extraplayer.score += score;
    }

    function swap(array, i, j)
    {
      var s = array[i];
      array[i] = array[j];
      array[j] = s;
      return array;
    }

    //Takes an array of player objects and sees if they can validly play against each other
    function isplayable(array)
    {
      for (var i = 0; i < array.length/2; i++)
      {
        var opponent = array[i+array.length/2].name;
        var str = "";
        if (array[i].playedagainst[opponent] == true)
        {
          for (q = 0; q < array.length; q++)
          {
            str += array[q].name + " ";
          }
          return false;
        }
      }
      return true;
    }

    function checkperms(array, i) { //Olength is the original size of the length
      var j = array.length-1;
      if (i < array.length-2)
      {
        while (i < j)
        {
          arr = checkperms(array, i+1);
          if (arr != false)
          {
            return arr;
          }
          array = swap(array, i, j);
          arr = checkperms(array, i+1);
          if (arr != false)
            return arr;

          array = swap(array, i, j);
          j--;
        }
      }

      else {
        if (isplayable(array))
          return array;
        array = swap(array, i, j);
        if (isplayable(array))
          return array;
        array = swap(array, i, j);
        return false;
      }

      return false;
    }

    function getperms(array)
    {
      return checkperms(array, 0);
    }


    for (var x = 0; x < values.length; x++)
    {
      var y = values[x];
      var check = true;
      for (var z = 0; z < scores[y].length/2; z++)
      {
        var opponent = scores[y][z+scores[y].length/2].name;
        if (scores[y][z].playedagainst[opponent] == true)
        {
          if (scores[y].length > 2 && check)
          {
            check = getperms(scores[y]);
            if (check != false)
            {
              scores[y] = check;
              break;
            }
            z--;
          }
          else if (x == values.length-1) {
            scores[values[x-1]] = scores[values[x-1]].concat(scores[values[x]]);
            scores[values[x]] = [];
            check = true;
            values.splice(x, 1);
            x--;
            break;
          }
          else
          {
            scores[values[x]] = scores[values[x]].concat(scores[values[x+1]]);
            scores[values[x+1]] = [];
            values.splice(x+1, 1);
            check = true;
            z = -1;
          }
        }
      }
    }

    var temp = [];

    for (var x = 0; x < values.length; x++) //TODO: Check if two players who played against each other might end up doing so again.
    {
      var y = values[x]; //Our actual index value. Since the value is sorted backwards this goes top down.
      for (var z = 0; z < scores[y].length/2; z++)
      {
        var opponent = scores[y][z].name;
        var matchObj = {
          playerOne: scores[y][z].name,
          playerTwo: scores[y][z+scores[y].length/2].name,
          played: false,
          p1score: 0,
          p2score: 0,
          ties: 0
        }
        temp.push(matchObj);
      }
    }
    var newpl = JSON.parse(JSON.stringify(players));
    newpl.sort(function(a, b) {
      return b.score - a.score;
    })
    var newevent = {
      players: newpl,
      matches: temp
    }
    rounds.push(newevent);
    Events.update(eventID, {
      $set: {
        [`brackets.0.rounds`]: rounds
      }
    })
  },

  "events.update_roundmatch"(eventID, roundNumber, matchNumber, score, winfirst, winsecond, ties)
  {
    var event = Events.findOne(eventID);
    var prevround;
    if (roundNumber > 0)
      prevround = event.brackets[0].rounds[roundNumber-1];
    event = event.brackets[0].rounds[roundNumber];
    event.matches[matchNumber].p1score = winfirst;
    event.matches[matchNumber].p2score = winsecond;
    event.matches[matchNumber].ties = ties;
    var prevmatch1, prevmatch2;
    if (roundNumber < 1)
    {
      prevmatch1 = {score: 0, wins: 0, losses: 0};
      prevmatch2 = {score: 0, wins: 0, losses: 0};
    }
    else
    {
      var prep1 = prevround.pdic[ event.matches[matchNumber].playerOne ];
      var prep2 = prevround.pdic[ event.matches[matchNumber].playerTwo ];
      prevmatch1 = prevround.players[prep1];
      prevmatch2 = prevround.players[prep2];
    }
    var p1 = event.pdic[event.matches[matchNumber].playerOne];
    var p2 = event.pdic[event.matches[matchNumber].playerTwo];
    event.players[p1].score = prevmatch1.score + score*winfirst;
    event.players[p1].wins = prevmatch1.wins + winfirst;
    event.players[p1].losses = prevmatch1.losses + winsecond;
    event.players[p2].score = prevmatch2.score + score*winsecond;
    event.players[p2].wins = prevmatch2.wins + winsecond;
    event.players[p2].losses = prevmatch2.losses + winfirst;

    Events.update(eventID, {
      $set: {
        [`brackets.0.rounds.${roundNumber}`]: event
      }
    })
  },

  "events.update_roundrobin"(eventID, roundNumber, score) { //For swiss specifically
    var event = Events.findOne(eventID);
    rounds = event.brackets[0].rounds;
    var playerarr = event.brackets[0].rounds[0].players;
    event = event.brackets[0].rounds[roundNumber];
    var lastp = playerarr.pop();
    playerarr.splice(1, 0, lastp);
    var participants = playerarr.map(function(x) { return x.name })
    var temp = [];
    for (var x = 0; x < Math.floor(participants.length/2); x++)
    {
      if (participants[participants.length - x - 1] != "" && participants[x] != "")
      {
        var matchObj = {
          playerOne: participants[x],
          playerTwo: participants[participants.length - x - 1],
          played: false,
          p1score: 0,
          p2score: 0,
          ties: 0
        };
        temp.push(matchObj);
      }
    }
    var tempb = JSON.parse(JSON.stringify(playerarr));
    var pdic = [];
    for (var x = 0; x < tempb.length; x++)
      pdic[tempb[x].name] = x;
    var roundObj = {
      matches: temp,
      players: tempb,
      score: score,
      pdic: pdic
    };
    rounds.push(roundObj);
    Events.update(eventID, {
      $set: {
        [`brackets.0.rounds`]: rounds
      }
    });
  }

})
