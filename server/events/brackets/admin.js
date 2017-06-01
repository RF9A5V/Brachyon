import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";

Meteor.methods({
  "events.brackets.removeParticipant"(id, index, alias) {
    var instance = Instances.findOne(id);
    if(!instance) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var event = Events.findOne({instances: id});
    var user = Meteor.users.findOne({username: alias});
    if(event && event.league) {
      var league = Leagues.findOne(event.league);
      var eventIndex = league.events.findIndex(o => { return o.id == event._id});
      Leagues.update(event.league, {
        $unset: {
          [`leaderboard.${eventIndex}.${user._id}`]: 1
        }
      });
    }
    Instances.update(instance._id, {
      $pull: {
        [`brackets.${index}.participants`]: {
          alias
        }
      }
      // $unset: {
      //   [`tickets.payables.${user._id}`]: 1
      // }
    })
  },
  "events.brackets.updateMatchScore"(id, useP1, value) {
    var scoreField = useP1 ? 0 : 1;
    Matches.update(id, {
      $inc: {
        [`players.${scoreField}.score`]: value
      }
    });
  },
  "events.brackets.setAlias"(instanceId, bracketIndex, oldAlias, alias) {
    const instance = Instances.findOne(instanceId);
    const bracket = instance.brackets[bracketIndex];
    const conflict = bracket.participants.findIndex(p => {
      return p.alias == alias;
    });
    if(conflict >= 0) {
      throw new Meteor.Error(404, "Alias is already taken, pick another.");
    }
    const participantIndex = bracket.participants.findIndex(p => {
      return p.alias == oldAlias;
    });
    if(bracket.id) {
      const bObj = Brackets.findOne(bracket.id);
      var matches = [];
      if(bracket.format.baseFormat == "single_elim" || bracket.format.baseFormat == "double_elim") {
        bObj.rounds.forEach(b => {
          b.forEach(r => {
            r.forEach(m => {
              if(m) {
                matches.push(m.id);
              }
            })
          })
        })
      }
      Matches.update({
        _id: {
          $in: matches
        },
        [`players.alias`]: oldAlias
      }, {
        $set: {
          "players.$.alias": alias
        }
      }, {
        multi: true
      })
    }
    Instances.update(instanceId, {
      $set: {
        [`brackets.${bracketIndex}.participants.${participantIndex}.alias`]: alias
      }
    })
  },
  "events.brackets.setPaymentInfo"(instanceId, bracketIndex, alias, amount) {
    const instance = Instances.findOne(instanceId);
    const bracketMeta = instance.brackets[bracketIndex];
    const participantIndex = bracketMeta.participants.findIndex(o => {
      return o.alias == alias;
    });
    const participant = bracketMeta.participants[participantIndex];
    Instances.update(instanceId, {
      $set: {
        [`brackets.${bracketIndex}.participants.${participantIndex}.paid`]: true,
        [`brackets.${bracketIndex}.participants.${participantIndex}.paymentAmount`]: amount,
      }
    })
  },
  "brackets.replaceBye"(instanceId, bracketIndex, index, user) {
    const instance = Instances.findOne(instanceId);
    if(instance.league && !user.id) {
      throw new Meteor.Error("League bracket needs a user.");
    }
    user.checkedIn = true;
    const bracketMeta = instance.brackets[bracketIndex];
    if(bracketMeta.id) {
      const bracket = Brackets.findOne(bracketMeta.id);
      // Only works for single and double elim right now
      var matches = [];
      bracket.rounds.forEach(b => {
        b.forEach(r => {
          r.forEach(m => {
            if(m) {
              matches.push(m.id);
            }
          })
        })
      });
      const aliasTarget = bracketMeta.participants[index].alias;
      matches.forEach(m => {
        var updateObj = {};
        const match = Matches.findOne(m);
        const playerIndex = match.players.findIndex(o => {
          return o && o.alias == aliasTarget;
        });
        if(playerIndex >= 0) {
          updateObj[`players.${playerIndex}.alias`] = user.alias;
          updateObj[`players.${playerIndex}.id`] = user.id;
        }
        if(match.winner && match.winner.alias == user.alias) {
          updateObj[`winner.alias`] = user.alias;
          updateObj[`winner.id`] = user.id;
        }
        if(Object.keys(updateObj).length) {
          Matches.update(m, {
            $set: updateObj
          });
        }
      });
    }
    Instances.update(instanceId, {
      $set: {
        [`brackets.${bracketIndex}.participants.${index}`]: user
      }
    })
  }
})
