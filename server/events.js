import OrganizeSuite from "./tournament_api.js";
import Notifications from "/imports/api/users/notifications.js";
import Brackets from "/imports/api/brackets/brackets.js"
import Leagues from "/imports/api/leagues/league.js";
import Matches from "/imports/api/event/matches.js";

import Instances from "/imports/api/event/instance.js";

Meteor.methods({

  "events.addParticipant"(eventID, bracketIndex, userID, alias) {
    var event = Events.findOne(eventID);
    var instance;
    if(event) {
      // Hack.
      // If the event ID collides with an instance ID, shit will likely break.
      var instance = Instances.findOne(event.instances[event.instances.length - 1]);
    }
    else {
      var instance = Instances.findOne(eventID);
    }

    if(userID) {
      alias = Meteor.users.findOne(userID).username;
    }
    else {
      if(event && event.league) {
        throw new Meteor.Error("Can't add a non-user player to a league event!");
      }
    }
    if(alias == "" || alias == null) {
      throw new Meteor.Error(403, "Alias for a participant has to exist.");
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
      if(event) {
        var note = Notifications.findOne({ type: "eventInvite", event: event._id, recipient: userID });
        if(note) {
          throw new Meteor.Error(403, "Notification already sent!");
        }
        else {
          var owner = Meteor.users.findOne(event.owner);
          // Notifications.insert({
          //   type: "eventInvite",
          //   owner: owner.username,
          //   image: owner.profile.imageUrl,
          //   event: event.details.name,
          //   eventSlug: event.slug,
          //   alias,
          //   recipient: userID,
          //   seen: false
          // });
        }
      }
    }
    Instances.update(instance._id, {
      $push: {
        [`brackets.${bracketIndex}.participants`]: {
          id: userID,
          alias: alias,
          checkedIn: true
        }
      }
    });
    if(event && event.league) {
      var league = Leagues.findOne(event.league);
      var leaderboardIndex = league.events.indexOf(event.slug);
      var setObj = {
        [`leaderboard.${leaderboardIndex}.${userID}`]: {
          score: 0,
          bonus: 0
        }
      };
      Leagues.update({ _id: event.league }, {
        $set: setObj
      })
    }
  },

  "events.removeParticipant"(eventID, bracketIndex, userId) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var instance = Instances.findOne(event.instances.pop());
    var bracket = instance.brackets[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }

    if(event.league) {
      var league = Leagues.findOne(event.league);
      var leaderboardIndex = league.events.indexOf(event.slug);
      Leagues.update(event.league, {
        $unset: {
          [`leaderboard.${leaderboardIndex}.${userId}`]: 1
        }
      })
    }
    Instances.update(instance._id, {
      $pull: {
        [`brackets.${bracketIndex}.participants`]: {
          id: userId
        }
      }
    })
  },

  "events.checkInUser"(eventId, bracketIndex, alias) {
    const event = Events.findOne(eventId);
    const instance = Instances.findOne(event.instances.pop());
    const userIndex = instance.brackets[bracketIndex].participants.findIndex(i => {
      return i.alias == alias;
    })
    Instances.update(instance._id, {
      $set: {
        [`brackets.${bracketIndex}.participants.${userIndex}.checkedIn`]: true
      }
    });
  },

  "events.registerUser"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var instance = Instances.findOne(event.instances.pop());
    var bracket = instance.brackets[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    var user = Meteor.user();
    if(!user) {
      throw new Meteor.Error(403, "You must be logged in to register yourself for an event!");
    }
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
    // if(Notifications.findOne({ recipient: event.owner, eventSlug: event.slug, userId: user._id })) {
    //   throw new Meteor.Error(403, "You've already requested entry to this event.");
    // }
    // Notifications.insert({
    //   type: "eventRegistrationRequest",
    //   recipient: event.owner,
    //   image: user.profile.imageUrl,
    //   user: user.profile.alias || user.profile.username,
    //   userId: user._id,
    //   eventSlug: event.slug,
    //   event: event.details.name,
    //   read: false
    // });
    if(event.league) {
      var league = Leagues.findOne(event.league);
      var leaderboardIndex = league.events.indexOf(event.slug);
      var setObj = {
        [`leaderboard.${leaderboardIndex}.${user._id}`]: {
          score: 0,
          bonus: 0
        }
      };
      Leagues.update({ _id: event.league }, {
        $set: setObj
      })
    }
    Instances.update(instance._id, {
      $push: {
        [`brackets.${bracketIndex}.participants`]: {
          id: user._id,
          alias,
          checkedIn: false
        }
      }
    })
  },

  "events.change_seeding"(eventID, index, oldVal, newVal)
  {
    var instance = Instances.findOne(eventID);
    if(!instance) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var nparticipants = instance.brackets[index].participants;
    participant = nparticipants[oldVal];
    nparticipants.splice(oldVal, 1); //Delete the participant off the list
    nparticipants.splice(newVal, 0, participant); //Put him back at his new seeding area.
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.participants`]: nparticipants
      }
    })
  },

  "events.shuffle_seeding"(eventID, index, nparticipants)
  {
    var instance = Instances.findOne(eventID);
    if(!instance) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.participants`]: nparticipants
      }
    })
  },

  "events.update_scoring"(eventID, index, score)
  {
    var instance = Instances.findOne(eventID);
    if(!instance) {
      throw new Meteor.error(404, "Couldn't find this event!");
    }
    Instances.update(instance._id, {
      $set: {
        [`brackets.${index}.score`]: score
      }
    });
  },

  "events.start_event"(id, index) {
    const instance = Instances.findOne(id);
    if(!instance) {
      if(!instance) {
        throw new Meteor.Error(404, "Couldn't find this event!");
      }
    }
    var organize = instance.brackets[index];
    var format = instance.brackets[index].format.baseFormat;
    var rounds = [];
    if (format == "single_elim") {
      rounds = OrganizeSuite.singleElim(organize.participants);
    }
    else if (format == "double_elim") {
      rounds = OrganizeSuite.doubleElim(organize.participants);
    }
    else if (format == "swiss") {
      rounds = OrganizeSuite.swiss(organize.participants.map(p => { return p.alias }));
    }
    else {
      rounds = OrganizeSuite.roundRobin(organize.participants.map(p => {return p.alias}));
    }
    if(format == "single_elim" || format == "double_elim") {
      if(instance.brackets[index].id) {
        var bracket = Brackets.findOne(instance.brackets[index].id);
        var matches = [];
        bracket.rounds.forEach(b => {
          b.map(r => {
            r.map(m => {
              if(m) {
                matches.push(m.id);
              }
            })
          })
        })
        Matches.remove({ _id: { $in: matches } });
      }
      var pipes = {};
      rounds = rounds.map((b, i) => {
        return b.map((r, j) => {
          return r.map((m, k) => {

            if(m.playerOne === null && m.playerTwo === null && i == 0 && j == 0) {
              return null;
            }
            if(i == 1 && j < 2 && (!pipes[j] || pipes[j].indexOf(k) < 0)) {
              return null;
            }

            var obj = {};
            var players = [];
            players.push(m.playerOne ? { alias: m.playerOne.alias, id: m.playerOne.id, score: 0 } : null);
            players.push(m.playerTwo ? { alias: m.playerTwo.alias, id: m.playerTwo.id, score: 0 } : null);

            if(m.losr >= 0 && m.losm >= 0 && m.losr !== null && m.losm !== null) {
              obj.losr = m.losr;
              obj.losm = m.losm;
              pipes[m.losr] ? pipes[m.losr].push(m.losm) : (pipes[m.losr] = [m.losm]);
            }
            var match = Matches.insert({ players });
            obj.id = match;
            return obj;
          })
        })
      })
    }

    if(!instance.brackets[index].id) {
      var br;
      if (format == "swiss" || format == "round_robin")
      {
        br = Brackets.insert({
          rounds: rounds,
          score: organize.score
        });
      }
      else
        br = Brackets.insert({
          rounds: rounds
        });


      Instances.update(instance._id, {
        $set: {
          [`brackets.${index}.inProgress`]: true,
          [`brackets.${index}.id`]: br,
          [`brackets.${index}.startedAt`]: new Date()
        },
        $unset: {
          [`brackets.${index}.score`]: ""
        }
      })
    }
    else {
      Brackets.update(instance.brackets[index].id, {
        $set: {
          rounds
        }
      })
    }

  },

  "events.advance_single"(bracketId, bracketIndex, round, index) {
    var bracket = Brackets.findOne(bracketId);
    var matchId = bracket.rounds[0][round][index].id;
    var match = Matches.findOne(matchId);

    if(match.players[0] == null || match.players[1] == null) {
      return;
    }

    var players = match.players.sort((a, b) => {
      return b.score - a.score;
    });
    if(players[0].score == players[1].score) {
      return;
    }

    if(bracket.rounds[0][round + 1]) {
      var nextId = bracket.rounds[0][round + 1][Math.floor(index / 2)].id;
      var nextMatch = Matches.findOne(nextId);
      if(nextMatch) {
        Matches.update(nextId, {
          $set: {
            [`players.${index % 2}`]: {
              id: players[0].id,
              alias: players[0].alias,
              score: 0
            }
          }
        });
      }
    }
    else {
      Brackets.update(bracketId, {
        $set: {
          complete: true
        }
      })
    }

    Matches.update(matchId, {
      $set: {
        winner: {
          alias: players[0].alias,
          id: players[0].id
        }
      }
    });
  },

  "events.advance_double"(bracketId, bracketIndex, roundIndex, index) {
    Meteor.call("events._advance_double", bracketId, bracketIndex, roundIndex, index, () => {
      var bracket = Brackets.findOne(bracketId);
      var matchId = bracket.rounds[bracketIndex][roundIndex][index].id;
      var match = Matches.findOne(matchId);

      if(match.players[0] == null || match.players[1] == null) {
        return;
      }

      var players = match.players.sort((a, b) => {
        return b.score - a.score;
      });
      Matches.update(matchId, {
        $set: {
          winner: {
            alias: players[0].alias,
            id: players[0].id
          }
        }
      });
    })
  },

  "events._advance_double"(bracketId, bracketIndex, roundIndex, index) {
    var bracket = Brackets.findOne(bracketId);
    var matchId = bracket.rounds[bracketIndex][roundIndex][index].id;
    var match = Matches.findOne(matchId);

    if(match.players[0] == null || match.players[1] == null) {
      return;
    }

    var players = match.players.slice().sort((a, b) => {
      return b.score - a.score;
    });
    if(players[0].score == players[1].score) {
      return;
      throw new Meteor.Error(403, "Cannot advance match with tie!");
    }
    // Grand Finals Results
    if(bracketIndex == 2) {
      if(players[0].alias == match.players[0].alias || roundIndex == 1) {
        Brackets.update(bracketId, {
          $set: {
            complete: true
          }
        })
        return;
      }
      else {
        var advMatchId = bracket.rounds[bracketIndex][roundIndex + 1][0].id;
        var advMatch = Matches.findOne(advMatchId);
        Matches.update(advMatchId, {
          $set: {
            players: [
              {
                alias: match.players[0].alias,
                id: match.players[0].id,
                score: 0
              },
              {
                alias: match.players[1].alias,
                id: match.players[1].id,
                score: 0
              }
            ]
          }
        });
        return;
      }
    }
    // END Grand Final Results
    var advIndex = Math.floor(index / 2);
    if(bracketIndex == 1 && roundIndex % 2 == 0) {
      advIndex = index;
    }
    if(roundIndex + 1 == bracket.rounds[bracketIndex].length) {
      var winMatchId = bracket.rounds[2][0][0].id;
      var winMatch = Matches.findOne(winMatchId);
      Matches.update(winMatchId, {
        $set: {
          [`players.${bracketIndex}`]: {
            alias: players[0].alias,
            id: players[0].id,
            score: 0
          }
        }
      });
    }
    else {
      var winMatchId = bracket.rounds[bracketIndex][roundIndex + 1][advIndex].id;
      var winMatch = Matches.findOne(winMatchId);

      if(winMatch) {
        var playerPos = index % 2;
        if(bracketIndex == 1 && roundIndex % 2 == 0) {
          playerPos = 1;
        }
        Matches.update(winMatchId, {
          $set: {
            [`players.${playerPos}`]: {
              alias: players[0].alias,
              id: players[0].id,
              score: 0
            }
          }
        })
      }
    }
    if(bracketIndex == 0) {
      var losr = bracket.rounds[bracketIndex][roundIndex][index].losr;
      var losm = bracket.rounds[bracketIndex][roundIndex][index].losm;
      var loserMatchId = bracket.rounds[1][losr][losm].id;
      var loserMatch = Matches.findOne(loserMatchId);
      if(loserMatch) {
        var playerPos = loserMatch.players[0] == null ? 0 : 1;
        if(roundIndex == 0) {
          playerPos = index % 2;
        }
        Matches.update(loserMatchId, {
          $set: {
            [`players.${playerPos}`]: {
              alias: players[1].alias,
              id: players[1].id,
              score: 0
            }
          }
        });
      }
    }
  },

  "events.place_winner"(bracketID, bracketNumber, roundNumber, matchNumber){
    return;
  },

  "events.undo_single"(bracketId, bracketIndex, roundIndex, index) {
    var bracket = Brackets.findOne(bracketId);
    var match = Matches.findOne(bracket.rounds[bracketIndex][roundIndex][index].id);
    var cb = (_roundIndex, _index, direction) => {
      if(_roundIndex >= bracket.rounds[bracketIndex].length) {
        return;
      }
      var internalMatch = Matches.findOne(bracket.rounds[bracketIndex][_roundIndex][_index].id);
      if(internalMatch.players[direction] == null) {
        return;
      }
      Matches.update(internalMatch._id, {
        $set: {
          winner: null,
          [`players.${direction}`]: null
        }
      });
      cb(_roundIndex + 1, Math.floor(_index / 2), _index % 2);
    }
    cb(roundIndex + 1, Math.floor(index / 2), index % 2);
    Matches.update(match._id, {
      $set: {
        winner: null
      }
    });
    Brackets.update(bracketId, {
      $set: {
        complete: false
      }
    })
  },

  "events.undo_double"(bracketId, bracketIndex, roundIndex, index) {
    var bracket = Brackets.findOne(bracketId);
    var metadata = bracket.rounds[bracketIndex][roundIndex][index];
    var match = Matches.findOne(metadata.id);
    var cb = (_bracketIndex, _roundIndex, _index, direction) => {
      if(_roundIndex >= bracket.rounds[_bracketIndex].length) {
        cb(2, 0, 0, _bracketIndex);
        return;
      }
      var internalMeta = bracket.rounds[_bracketIndex][_roundIndex][_index];
      var internalMatch = Matches.findOne(internalMeta.id);
      if(internalMatch.players[direction] == null) {
        return;
      }
      Matches.update(internalMatch._id, {
        $set: {
          winner: null,
          [`players.${direction}`]: null
        }
      });
      var _nextIndex = (_bracketIndex == 0 || _roundIndex % 2) ? Math.floor(_index / 2) : _index;
      var _nextPos = (_bracketIndex == 0 || _roundIndex % 2) ? _index % 2 : 1;
      cb(_bracketIndex, _roundIndex + 1, _nextIndex, _nextPos);
      if(_bracketIndex == 0) {
        cb(1, internalMeta.losr, internalMeta.losm, 0);
      }
    }
    var nextIndex = (bracketIndex == 0 || roundIndex % 2) ? Math.floor(index / 2) : index;
    var nextPos = (bracketIndex == 0 || roundIndex % 2) ? index % 2 : 1;
    cb(bracketIndex, roundIndex + 1, nextIndex, nextPos);
    if(bracketIndex == 0) {
      cb(1, metadata.losr, metadata.losm, roundIndex == 0 ? index % 2 : 0);
    }
    Matches.update(match._id, {
      $set: {
        winner: null
      }
    });
    Brackets.update(bracketId, {
      $set: {
        complete: false
      }
    })
  },

  "events.update_match"(bracketID, roundNumber, matchNumber, score, winfirst, winsecond, ties)
  {
    var bracket = Brackets.findOne(bracketID);
    if (roundNumber > 0)
      var prevround = bracket.rounds[roundNumber-1];
    var score = bracket.score;
    bracket = bracket.rounds[roundNumber];
    bracket.matches[matchNumber].p1score = winfirst;
    bracket.matches[matchNumber].p2score = winsecond;
    bracket.matches[matchNumber].ties = ties;
    var p1 = bracket.matches[matchNumber].playerOne;
    var p2 = bracket.matches[matchNumber].playerTwo;
    var prevmatch1, prevmatch2;
    if (roundNumber < 1)
    {
      prevmatch1 = {score: 0, wins: 0, losses: 0, ties: 0};
      prevmatch2 = {score: 0, wins: 0, losses: 0, ties: 0};
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
        bracket.players[x].score = prevmatch1.score + score.wins * winfirst + score.loss * winsecond + score.ties * ties;
        bracket.players[x].wins = prevmatch1.wins + winfirst;
        bracket.players[x].losses = prevmatch1.losses + winsecond;
        bracket.players[x].ties = prevmatch1.ties + ties;
        if(!bracket.players[x].playedagainst) {
          bracket.players[x].playedagainst = {};
        }
        bracket.players[x].playedagainst[p2] = true;
      }
      if (bracket.players[x].name == p2)
      {
        bracket.players[x].score = prevmatch2.score + score.wins * winsecond + score.loss * winfirst + score.ties * ties;
        bracket.players[x].wins = prevmatch2.wins + winsecond;
        bracket.players[x].losses = prevmatch2.losses + winfirst;
        if(!bracket.players[x].playedagainst) {
          bracket.players[x].playedagainst = {};
        }
        bracket.players[x].playedagainst[p1] = true;
      }
    }
    Brackets.update(bracketID, {
      $set: {
        [`rounds.${roundNumber}`]: bracket
      }
    })
  },

  "events.complete_match"(bracketID, roundNumber, matchNumber) //Also used for round robin because of how stupidly simple this is of a function.
  {
    var bracket = Brackets.findOne(bracketID);
    bracket = bracket.rounds[roundNumber];
    bracket.matches[matchNumber].played = true;
    Brackets.update(bracketID, {
      $set: {
        [`rounds.${roundNumber}`]: bracket
      }
    })
  },

  "events.tiebreaker"(bracketID, roundNumber, score)
  {
    var bracket = Brackets.findOne(bracketID).rounds[roundNumber];
    var max = -1, tied = false, tiedplayers = [];
    for (var x = 0; x < bracket.players.length; x++)
    {
      if (max < bracket.players[x].score)
      {
        max = bracket.players[x].score;
        tiedplayers = [];
        tiedplayers.push(bracket.players[x].name);
        tied = false;
      }
      else if (max == bracket.players[x].score)
      {
        tiedplayers.push(bracket.players[x].name);
        tied = true;
      }
    }
    if (tied == false)
      return true;

    var p1 = bracket.pdic[tiedplayers[0]], p2 = bracket.pdic[tiedplayers[1]]; //pdic contains their index in this rounds' player array.
    //TODO: Make system dynamic array for 3+ tied players
    var bnum1 = 0, bnum2 = 0;

    for (var y = 0; y < bracket.players.length; y++)
    {
      var name = bracket.players[y].name;
      if (bracket.players[p1].playedagainst[name] = true)
        bnum1 += bracket.players[y].score;
      if (bracket.players[p2].playedagainst[name] = true)
        bnum2 += bracket.players[y].score;
    }

    if (bnum1 > bnum2)
      bracket.players[p1].score += 1;
    else if (bnum2 > bnum1)
      bracket.players[p2].score += 1;
    else
      return false;
    Brackets.update(bracketID, {
      $set: {
        [`rounds.${roundNumber}`]: bracket
      }
    });

    return true;
  },

  "events.update_round"(bracketID, roundNumber, score) { //For swiss specifically
    var bracket = Brackets.findOne(bracketID);
    score = bracket.score;
    rounds = bracket.rounds;
    bracket = bracket.rounds[roundNumber];
    var players = bracket.players;
    var key = 'score';
    var scores = [];
    var max = 0;

    //

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
      extraplayer.score += score.byes;
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
    var pdic = {};
    for (var x = 0; x < newpl.length; x++)
      pdic[newpl[x].name] = x;
    var newevent = {
      matches: temp,
      players: newpl,
      pdic: pdic
    }
    rounds.push(newevent);
    Brackets.update(bracketID, {
      $set: {
        [`rounds`]: rounds
      }
    })
  },

  "events.update_roundmatch"(bracketID, roundNumber, matchNumber, score, winfirst, winsecond, ties)
  {
    var bracket = Brackets.findOne(bracketID);
    var prevround;
    if (roundNumber > 0)
      prevround = bracket.rounds[roundNumber-1];
    bracket = bracket.rounds[roundNumber];
    bracket.matches[matchNumber].scoreOne = winfirst;
    bracket.matches[matchNumber].scoreTwo = winsecond;
    bracket.matches[matchNumber].ties = ties;
    var prevmatch1, prevmatch2;
    if (roundNumber < 1)
    {
      prevmatch1 = {score: 0, wins: 0, losses: 0};
      prevmatch2 = {score: 0, wins: 0, losses: 0};
    }
    else
    {
      var prep1 = prevround.pdic[ bracket.matches[matchNumber].playerOne ];
      var prep2 = prevround.pdic[ bracket.matches[matchNumber].playerTwo ];
      prevmatch1 = prevround.players[prep1];
      prevmatch2 = prevround.players[prep2];
    }
    var p1 = bracket.pdic[bracket.matches[matchNumber].playerOne];
    var p2 = bracket.pdic[bracket.matches[matchNumber].playerTwo];
    bracket.players[p1].score = prevmatch1.score + score*winfirst;
    bracket.players[p1].wins = prevmatch1.wins + winfirst;
    bracket.players[p1].losses = prevmatch1.losses + winsecond;
    bracket.players[p2].score = prevmatch2.score + score*winsecond;
    bracket.players[p2].wins = prevmatch2.wins + winsecond;
    bracket.players[p2].losses = prevmatch2.losses + winfirst;

    Brackets.update(bracketID, {
      $set: {
        [`rounds.${roundNumber}`]: bracket
      }
    })
  },

  "events.update_roundrobin"(bracketID, roundNumber, score) { //For swiss specifically
    var bracket = Brackets.findOne(bracketID);
    var rounds = bracket.rounds;
    var playerarr = bracket.rounds[0].players;
    bracket = bracket.rounds[roundNumber];
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
          scoreOne: 0,
          scoreTwo: 0,
          ties: 0
        };
        temp.push(matchObj);
      }
    }
    var tempb = JSON.parse(JSON.stringify(playerarr));
    var pdic = {};
    for (var x = 0; x < tempb.length; x++)
      pdic[tempb[x].name] = x;
    var roundObj = {
      matches: temp,
      players: tempb,
      score: score,
      pdic: pdic
    };
    rounds.push(roundObj);
    Brackets.update(bracketID, {
      $set: {
        [`rounds`]: rounds
      }
    });
  },

  "events.endGroup"(eventID, bracketIndex) {

    var event = Events.findOne(eventID);
    var instance;
    var bracket;
    var players = {};
    var roundobj;
    if(!event) {
      instance = Instances.findOne(eventID);
    }
    else {
      var instance = Instances.findOne(event.instances.pop());
    }
    if(!instance) {
      var league = Leagues.findOne(eventID);
      roundobj = Brackets.findOne(league.tiebreaker.id);
    }
    else {
      bracket = instance.brackets[bracketIndex];
      roundobj = Brackets.findOne(bracket.id);
      var brack = roundobj.rounds;
      instance.brackets[bracketIndex].participants.forEach(participant=>{players[participant.alias]={id:participant.id, losses:0, wins:0, ties:0}});

      for (var x = 0 ; x < brack.length ;  x ++){
        for (var j = 0 ; j < brack[x].matches.length ; j++){
          match= brack[x].matches[j];
          if (match.p1score>match.p2score){
            players[match.playerOne].wins = players[match.playerOne].wins ? players[match.playerOne].wins + 1: 1;
            players[match.playerTwo].losses = players[match.playerTwo].losses ? players[match.playerTwo].losses + 1: 1;
          }
          else if(match.p1score<match.p2score){
            players[match.playerTwo].wins = players[match.playerTwo].wins ? players[match.playerTwo].wins + 1: 1;
            players[match.playerOne].losses = players[match.playerOne].losses ? players[match.playerOne].losses + 1: 1;
          }
          else{
            players[match.playerTwo].ties = players[match.playerTwo].ties ? players[match.playerTwo].ties + 1: 1;
            players[match.playerOne].ties = players[match.playerOne].ties ? players[match.playerOne].ties + 1: 1;
          }
        }
      }
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



    // Weird, but works.
    // Pretty much find event by given ID, and if not found, try leagues.
    // For tiebreaker
    if(!event) {

      var incObj = {};
      var league = Leagues.findOne(eventID);
      if (league)
      {
        var bracket = Brackets.findOne(league.tiebreaker);
        var numPlayers = bracket.rounds[0].players.length;
        var ldrboard = {};
        bracket.rounds[bracket.rounds.length - 1].players.sort((a, b) => {
          return (b.score - a.score);
        }).map((obj, i) => {
          console.log(obj);
          var user = Meteor.users.findOne({ username: obj.name });
          if(!user) {
            return;
          }
          ldrboard[user._id] = {
            score: numPlayers - i,
            bonus: 0
          };
        });
        Leagues.update(eventID, {
          $push: {
            "leaderboard": ldrboard
          },
          $set: {
            complete: true
          }
        })
      }
    }
    else {
      var instance = Instances.findOne(event.instances.pop());
      Instances.update(instance._id, {
        $set: {
          [`brackets.${bracketIndex}.endedAt`]: new Date(),
          [`brackets.${bracketIndex}.isComplete`]: true
        }
      })
      if(event.league) {
        var league = Leagues.findOne(event.league);
        var bracket = Brackets.findOne(instance.brackets[bracketIndex].id);
        var numPlayers = bracket.rounds[bracket.rounds.length - 1].players.length;
        var eventIndex = league.events.indexOf(event.slug) + 1;
        var incObj = {};
        bracket.rounds[bracket.rounds.length - 1].players.sort((a, b) => {
          return (b.score - a.score);
        }).map((obj, i) => {
          var user = Meteor.users.findOne({ username: obj.name });
          var ldrboardIndex = league.leaderboard[eventIndex].findIndex(entry => {
            return entry.id == user._id;
          });
          var globalIndex = league.leaderboard[0].findIndex(entry => {
            return entry.id == user._id;
          })
          incObj[`leaderboard.${eventIndex}.${ldrboardIndex}.score`] = numPlayers - i;
          incObj[`leaderboard.0.${globalIndex}.score`] = numPlayers - i;
        });
        Leagues.update(event.league, {
          $inc: incObj,
          $set: {
            complete: true
          }
        })
      }
    }
  }

})
