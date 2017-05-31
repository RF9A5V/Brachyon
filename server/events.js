import OrganizeSuite from "/imports/decorators/organize.js";
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
    event = Events.findOne({
      instances: instance._id
    });

    if(userID) {
      alias = Meteor.users.findOne(userID).username;
    }
    else {
      if(event && event.league) {
        throw new Meteor.Error(404, "Can't add a non-user player to a league event!");
      }
    }
    if(alias == "" || alias == null) {
      throw new Meteor.Error(403, "Alias for a participant has to exist.");
    }
    if(instance.brackets == null || instance.brackets[bracketIndex] == null) {
      throw new Meteor.Error(404, "Couldn't find this bracket.");
    }
    var bracket = instance.brackets[bracketIndex];
    if(bracket.options && bracket.options.limit) {
      const partCount = (bracket.participants || []).length;
      if(partCount >= bracket.options.limit) {
        throw new Meteor.Error(404, "This bracket has reached its participant limit. Can't add any more people!");
      }
    }

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
      var leaderboardIndex = league.events.findIndex((e) => {
        return e.slug == event.slug;
      });
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
      var leaderboardIndex = league.events.findIndex((e) => {
        return e.slug == event.slug
      });
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
      var leaderboardIndex = league.events.findIndex(e => {
        return e.slug == event.slug;
      });
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
    var event = Events.findOne(id);
    var instance;
    var staggeredMessages = [];
    if(!event) {
      instance = Instances.findOne(id);
      event = Events.findOne({
        instances: id
      });
    }
    else {
      instance = Instances.findOne(event.instances.pop());
    }
    if(!instance) {
      throw new Meteor.Error(404, "Couldn't find this event!");
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
      rounds = OrganizeSuite.swiss(organize.participants);
    }
    else {
      rounds = OrganizeSuite.roundRobin(organize.participants);
    }
    if(format == "single_elim" || format == "double_elim") {
      if(instance.brackets[index].id) {
        var bracket = Brackets.findOne(instance.brackets[index].id);
        var matches = [];
        bracket.rounds.map(b => {
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
            const allPlayersPresent = players.every(p => {
              return p && p.alias != null;
            });
            if(allPlayersPresent) {
              staggeredMessages.push({
                ids: [
                  players[0].id,
                  players[1].id
                ],
                text: `Your match is ready! ${players[0].alias} vs. ${players[1].alias} is ready to play!`
              });
            }
            var match = Matches.insert({
              players,
              establishedAt: allPlayersPresent ? new Date() : null,
              startedAt: null,
              status: allPlayersPresent ? 1 : 0,
              stream: false
            });

            obj.id = match;
            return obj;
          })
        })
      })
    }
    if (format == "round_robin" || format == "swiss")
    {
      rounds.matches[0] = rounds.matches[0].map((m, i) =>
      {
        var players = [];
        players.push({alias: m.playerOne.alias, id: m.playerOne.id, score: 0});
        players.push({alias: m.playerTwo.alias, id: m.playerTwo.id, score: 0});
        var obj = {};
        obj.played = false;
        obj.id = Matches.insert({ players, ties: 0 });
        return obj;
      });
      var pl = rounds.players;
      var pdiclist = rounds.pdic;
      var rounds = rounds.matches;
    }

    if(!instance.brackets[index].id) {
      var br;
      if (format == "swiss" || format == "round_robin")
      {
        br = Brackets.insert({
          rounds,
          players: pl,
          pdic: pdiclist,
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

    // Notifications to players that bracket has started goes here.
    var notificationString = "";
    if(event) {
      notificationString = `/event/${event.slug}/bracket/${index}`;
    }
    else {
      notificationString = `/bracket/${instance.slug}`;
    }
    Meteor.call("messages.notifyAll", instance.brackets[index].participants.map(p => { return p.id }),
      `Bracket's started on Brachyon! Check it out at https://www.brachyon.com${notificationString}`
    );
    staggeredMessages.forEach(m => {
      Meteor.call("messages.notifyAll", m.ids, m.text);
    })
  },

  "events.stop_event"(id, index){
    const instance = Instances.findOne(id);
    const format = instance.brackets[index].format.baseFormat;
    const bracket = Brackets.findOne(instance.brackets[index].id);
    if(!bracket) {
      return null;
    }
    if(format == "single_elim" || format == "double_elim") {
      var matches = [];
      bracket.rounds.map(b => {
        b.map(r => {
          r.map(m => {
            if(m) {
              matches.push(m.id);
            }
          })
        })
      })
      Matches.remove({ _id: { $in: matches } });
      Brackets.remove(bracket._id);
      Instances.update(id, {
        $unset: {
          [`brackets.${index}.id`]: 1,
          [`brackets.${index}.startedAt`]: 1
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
        const nextHasPlayer = nextMatch.players.some(p => { return p && p.alias });
        if(nextHasPlayer) {
          var nextPlayers = nextMatch.players.filter(p => { return p }).concat([players[0]]);
          var ids = nextPlayers.map(p => { return p.id })
          Meteor.call("messages.notifyAll", ids,
            `Your match is ready! ${nextPlayers[0].alias} vs. ${nextPlayers[1].alias} is ready to play! You will be notified when you should play.`
          );
        }
        Matches.update(nextId, {
          $set: {
            [`players.${index % 2}`]: {
              id: players[0].id,
              alias: players[0].alias,
              score: 0
            },
            status: nextHasPlayer ? 1 : 0,
            establishedAt: nextHasPlayer ? new Date() : null
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
        },
        status: 3
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
          },
          status: 3
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
            ],
            status: 1,
            establishedAt: new Date()
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
    // For piping into grand finals.
    if(roundIndex + 1 == bracket.rounds[bracketIndex].length) {
      var winMatchId = bracket.rounds[2][0][0].id;
      var winMatch = Matches.findOne(winMatchId);
      var hasSomePlayer = winMatch.players.some(p => { return p && p.alias });
      // Notifications to players that their match is ready goes here (for winner's bracket).
      if(hasSomePlayer) {
        var objs = winMatch.players.filter(p => { return p }).concat([players[0]]);
        var aliases = objs.map(o => { return o.alias });
        var ids = objs.map(o => { return o.id });
        Meteor.call("messages.notifyAll", ids,
          `Your match is ready! ${aliases[0]} vs. ${aliases[1]} is ready to play! You will be notified when you should play.`
        );
      }
      Matches.update(winMatchId, {
        $set: {
          [`players.${bracketIndex}`]: {
            alias: players[0].alias,
            id: players[0].id,
            score: 0
          },
          establishedAt: hasSomePlayer ? new Date() : null,
          status: hasSomePlayer ? 1 : null
        }
      });
    }
    else {
      var winMatchId = bracket.rounds[bracketIndex][roundIndex + 1][advIndex].id;
      var winMatch = Matches.findOne(winMatchId);
      var hasSomePlayer = winMatch.players.some(p => { return p && p.alias });
      if(winMatch) {
        var playerPos = index % 2;
        if(bracketIndex == 1 && roundIndex % 2 == 0) {
          playerPos = 1;
        }
        // Notifications to players that their match is ready goes here (for winner's bracket).
        if(hasSomePlayer) {
          var objs = winMatch.players.filter(p => { return p }).concat([players[0]]);
          var aliases = objs.map(o => { return o.alias });
          var ids = objs.map(o => { return o.id });
          Meteor.call("messages.notifyAll", ids,
            `Your match is ready! ${aliases[0]} vs. ${aliases[1]} is ready to play! You will be notified when you should play.`
          );
        }
        Matches.update(winMatchId, {
          $set: {
            [`players.${playerPos}`]: {
              alias: players[0].alias,
              id: players[0].id,
              score: 0
            },
            status: hasSomePlayer ? 1 : 0,
            establishedAt: hasSomePlayer ? new Date() : null
          }
        })
      }
    }
    if(bracketIndex == 0) {
      var losr = bracket.rounds[bracketIndex][roundIndex][index].losr;
      var losm = bracket.rounds[bracketIndex][roundIndex][index].losm;
      var endRezzes = [];
      var loserMatchId = bracket.rounds[1][losr][losm].id;
      var loserMatch = Matches.findOne(loserMatchId);
      bracket.rounds[bracketIndex].forEach((_r, i) => {
        _r.forEach((_m, j) => {
          if(_m && _m.losr == losr && _m.losm == losm) {
            endRezzes.push({
              round: i,
              match: j
            });
          }
        });
      });
      endRezzes = endRezzes.sort((a, b) => {
        if(a.round != b.round) {
          return b.round - a.round;
        }
        else {
          return a.match - b.match;
        }
      });
      if(loserMatch) {
        const playerPos = endRezzes.findIndex(o => { return o.round == roundIndex && o.match == index });
        var hasSomePlayer = loserMatch.players.some(p => { return p && p.alias });

        // Notification that match is ready goes here (loser's bracket).
        if(hasSomePlayer) {
          var objs = loserMatch.players.filter(p => { return p }).concat([players[0]]);
          var aliases = objs.map(o => { return o.alias });
          var ids = objs.map(o => { return o.id });
          Meteor.call("messages.notifyAll", ids,
            `Your match is ready! ${aliases[0]} vs. ${aliases[1]} is ready to play! You will be notified when you should play.`
          );
        }
        Matches.update(loserMatchId, {
          $set: {
            [`players.${playerPos}`]: {
              alias: players[1].alias,
              id: players[1].id,
              score: 0
            },
            status: hasSomePlayer ? 1 : 0,
            establishedAt: hasSomePlayer ? new Date() : null
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
    var metadata = bracket.rounds[bracketIndex][roundIndex][index];
    var match = Matches.findOne(metadata.id);
    var cb = (_bracketIndex, _roundIndex, _index, alias) => {
      var internalMeta = bracket.rounds[_bracketIndex][_roundIndex][_index];
      var internalMatch = Matches.findOne(internalMeta.id);
      if(!internalMatch) {
        return;
      }
      Matches.update({
        _id: internalMeta.id,
        "players.alias": alias
      }, {
        $set: {
          winner: null,
          "players.$": null,
          status: 0,
          establishedAt: null,
          startedAt: null
        }
      });
      var _nextIndex = Math.floor(_index / 2);
      if(internalMatch.winner && _roundIndex < bracket.rounds[bracketIndex].length - 1) {
        var winnerAlias = internalMatch.winner.alias;
        var loserAlias = internalMatch.players.filter(p => { return p.alias != winnerAlias })[0].alias;
        cb(_bracketIndex, _roundIndex + 1, _nextIndex, winnerAlias);
      }
    }
    var nextIndex = Math.floor(index / 2);
    var winnerAlias = match.winner.alias;
    cb(bracketIndex, roundIndex + 1, nextIndex, winnerAlias);
    Matches.update(match._id, {
      $set: {
        winner: null,
        status: 1,
        startedAt: null
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

    var cb = (_bracketIndex, _roundIndex, _index, alias) => {
      if(_roundIndex >= bracket.rounds[_bracketIndex].length) {
        cb(2, 0, 0, _bracketIndex);
        return;
      }
      var internalMeta = bracket.rounds[_bracketIndex][_roundIndex][_index];
      var internalMatch = Matches.findOne(internalMeta.id);
      if(!internalMatch) {
        return;
      }
      Matches.update({
        _id: internalMeta.id,
        "players.alias": alias
      }, {
        $set: {
          winner: null,
          "players.$": null,
          status: 0,
          establishedAt: null,
          startedAt: null
        }
      });
      var _nextIndex = (_bracketIndex == 0 || _roundIndex % 2) ? Math.floor(_index / 2) : _index;
      if(internalMatch.winner) {
        var winnerAlias = internalMatch.winner.alias;
        var loserAlias = internalMatch.players.filter(p => { return p.alias != winnerAlias })[0].alias;
        cb(_bracketIndex, _roundIndex + 1, _nextIndex, winnerAlias);
        if(_bracketIndex == 0) {
          cb(1, internalMeta.losr, internalMeta.losm, loserAlias);
        }
      }
    }
    var nextIndex = (bracketIndex == 0 || roundIndex % 2) ? Math.floor(index / 2) : index;
    var winnerAlias = match.winner.alias;
    var loserAlias = match.players.filter(p => { return p.alias != winnerAlias })[0].alias;
    cb(bracketIndex, roundIndex + 1, nextIndex, winnerAlias);
    if(bracketIndex == 0) {
      cb(1, metadata.losr, metadata.losm, loserAlias);
    }
    Matches.update(match._id, {
      $set: {
        winner: null,
        status: 1,
        startedAt: null
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
    var match = Matches.findOne(bracket.rounds[roundNumber][matchNumber].id);
    match.players[0].score = winfirst;
    match.players[1].score = winsecond;
    match.ties = ties;
    var p1 = bracket.pdic[match.players[0].alias];
    var p2 = bracket.pdic[match.players[1].alias];
    bracket.players[p1].score += score*winfirst;
    bracket.players[p1].wins += winfirst;
    bracket.players[p1].losses += winsecond;
    bracket.players[p2].score += score*winsecond;
    bracket.players[p2].wins += winsecond;
    bracket.players[p2].losses += winfirst;

    Matches.update(match._id, {
      $set: match
    })
    Brackets.update(bracketID, {
      $set: bracket
    })
  },

  "events.complete_match"(bracketID, roundNumber, matchNumber) //Also used for round robin because of how stupidly simple this is of a function.
  {
    var bracket = Brackets.findOne(bracketID);
    Brackets.update(bracketID, {
      $set: {
        [`rounds.${roundNumber}.${matchNumber}.played`]: true
      }
    })
  },

  "events.tiebreaker"(bracketID, roundNumber, score)
  {
    var bracket = Brackets.findOne(bracketID);
    var max = -1, tied = false, tiedplayers = [];
    for (var x = 0; x < bracket.players.length; x++)
    {
      if (max < bracket.players[x].score)
      {
        max = bracket.players[x].score;
        tiedplayers = [];
        tiedplayers.push({name: bracket.players[x].name, score: 0});
        tied = false;
      }
      else if (max == bracket.players[x].score)
      {
        tiedplayers.push({name: bracket.players[x].name, score: 0});
        tied = true;
      }
    }
    if (tied == false)
      return true;

    for (var y = 0; y < bracket.players.length; y++)
    {
      for (var z = 0; z < tiedplayers.length; z++)
      {
        tiedplayers.score += bracket.players[y].score;
      }
    }

    tiedplayers.sort(function(a, b) {
      return b.score - a.score;
    });

    if (tiedplayers[0].score > tiedplayers[1].score)
      bracket.players[bracket.pdic[tiedplayers[0].name]].score += 1;
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
    var rounds = bracket.rounds;
    var players = bracket.players;
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
    var oldpl = players;
    for (var x = 0; x < values.length; x++) //TODO: Check if two players who played against each other might end up doing so again.
    {
      var y = values[x]; //Our actual index value. Since the value is sorted backwards this goes top down.
      for (var z = 0; z < scores[y].length/2; z++)
      {
        var opponent = scores[y][z].name;
        var players = [];
        players.push({alias: scores[y][z].name, id: scores[y][z].id, score: 0});
        players.push({alias: scores[y][z+scores[y].length/2].name, id: scores[y][z+scores[y].length/2].id, score: 0})
        var obj = {};

        obj.id = Matches.insert({ players, ties: 0 });
        obj.played = false;

        temp.push(obj);
      }
    }

    var newpl = JSON.parse(JSON.stringify(oldpl));
    newpl.sort(function(a, b) {
      return b.score - a.score;
    })
    var pdic = {};
    for (var x = 0; x < newpl.length; x++)
      pdic[newpl[x].name] = x;
    players = newpl;
    rounds.push(temp);
    Brackets.update(bracketID, {
      $set: {
        [`rounds`]: rounds,
        [`players`]: players,
        [`pdic`]: pdic
      }
    })
  },

//Round Robin Bracket Architecture is as follows:
//Bracket.rounds contains 4 parts to it, matches, players, score, and pdic
//Matches contain all the match collection ids we need to pull from the backend and whether they've been played or not
//Players contain the most up to date player objects, containing their wins, losses, ties, and so forth
//PDIC contains a dictionary of all player index ids. pdic["player_name"] will return the index of said player. Separated for sorting reasons

  "events.update_roundmatch"(bracketID, roundNumber, matchNumber, winfirst, winsecond, ties)
  {
    var bracket = Brackets.findOne(bracketID);
    var match = Matches.findOne(bracket.rounds[roundNumber][matchNumber].id);
    if ( (match.players[0].score <= 0 && winfirst < 0) || (match.players[1].score <= 0 && winsecond < 0) )
      return;
    match.players[0].score += winfirst;
    match.players[1].score += winsecond;
    match.ties += ties;
    var p1 = bracket.pdic[match.players[0].alias];
    var p2 = bracket.pdic[match.players[1].alias];
    bracket.players[p1].score += bracket.score.wins*winfirst + bracket.score.loss*winsecond + bracket.score.ties*ties;
    bracket.players[p1].wins += winfirst;
    bracket.players[p1].losses += winsecond;
    bracket.players[p2].score += bracket.score.wins*winsecond + bracket.score.loss*winfirst + bracket.score.ties*ties;
    bracket.players[p2].wins += winsecond;
    bracket.players[p2].losses += winfirst;

    Matches.update(match._id, {
      $set: match
    })
    Brackets.update(bracketID, {
      $set: bracket
    })
  },

  "events.update_roundrobin"(bracketID, roundNumber, score) { //For swiss specifically
    var bracket = Brackets.findOne(bracketID);
    var rounds = bracket.rounds;
    var playerarr = bracket.players;
    var lastp = playerarr.pop();
    playerarr.splice(1, 0, lastp);
    var participants = playerarr.map(function(x) { return x.name })
    var temp = [];
    for (var x = 0; x < Math.floor(playerarr.length/2); x++)
    {
      if (participants[playerarr.length - x - 1] != "" && participants[x] != "")
      {
        var obj = {};
        var players = [];

        players.push({alias: playerarr[x].name, id: playerarr[x].id, score: 0});
        players.push({alias: playerarr[participants.length - x - 1].name, id: playerarr[participants.length - x - 1].id, score: 0});

        const allPlayersExist = players.every(p => {
          return p.alias != null;
        })

        if(allPlayersExist) {
          obj.id = Matches.insert({ players, ties: 0 });
          obj.played = false;
          temp.push(obj);
        }

      }
    }
    var tempb = JSON.parse(JSON.stringify(playerarr));
    var pdic = {};
    for (var x = 0; x < tempb.length; x++)
      pdic[tempb[x].name] = x;
    rounds.push(temp);
    var players = playerarr;
    Brackets.update(bracketID, {
      $set: {
        [`rounds`]: rounds,
        [`players`]: players,
        [`pdic`]: pdic
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
      if (league)
        roundobj = Brackets.findOne(league.tiebreaker.id);
    }
    else {
      bracket = instance.brackets[bracketIndex];
      if (bracket.format.baseFormat != "swiss")
      {
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
  },

  "participants.swapPlayers"(instanceID, bracketIndex, playerOne, playerTwo) {
    let participants = Instances.findOne(instanceID).brackets[bracketIndex].participants;
    let p1index = participants.findIndex( (participant) => {
      return participant.alias == playerOne;
    });
    let p2index = participants.findIndex( (participant) => {
      return participant.alias == playerTwo;
    });

    var temp = participants[p1index];
    participants[p1index] = participants[p2index];
    participants[p2index] = temp;
    Instances.update(instanceID, {
      $set: {
        [`brackets.${bracketIndex}.participants`]: participants
      }
    })
  },

  "participants.updateParticipants"(instanceID, bracketIndex, participants) {
    Instances.update(instanceID, {
      $set: {
        [`brackets.${bracketIndex}.participants`]: participants
      }
    })
  }

})
