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
    var userCount = 1;
    var roundobj = Brackets.findOne(bracket.id);
    var matchIds = [];
    roundobj.rounds.forEach(b => {
      b.forEach(r => {
        r.forEach(m => {
          if(m) {
            matchIds.push(m.id);
          }
        })
      })
    });
    var obj = {};
    if(bracket.format.baseFormat == "single_elim" || bracket.format.baseFormat == "double_elim") {
      bracket.participants.forEach(p => {
        var matches = Matches.find({
          _id: { $in: matchIds },
          "players.alias": p.alias
        }).fetch();
        var loss = 0;
        matches.forEach(m => {
          if(m.winner.alias != p.alias) {
            loss += 1;
          }
        });
        var wins = matches.length - loss;
        var key = `${wins}-${loss}`;
        if(!obj[key]) {
          obj[key] = [p];
        }
        else {
          obj[key].push(p);
        }
      });
    }
    Object.keys(obj).forEach(score => {
      var [wins, loss] = score.split("-").map(i => parseInt(i));
      var updateObject = {
        [`stats.${bracket.game}.wins`]: wins,
        [`stats.${bracket.game}.losses`]: loss,
        [`stats.${bracket.game}.ties`]: 0
      };
      obj[score].forEach(player => {
        Meteor.users.update(player.id,{$inc:updateObject});
      })
    });

    var cmd = {
      $set: {}
    };
    cmd["$set"][`brackets.${bracketIndex}.isComplete`] = true;
    cmd["$set"][`brackets.${bracketIndex}.inProgress`] = false;
    cmd["$set"][`brackets.${bracketIndex}.endedAt`] = new Date();

    // League update
    if(event && event.league) {
      var sortedKeys = Object.keys(obj).sort((a, b) => {
        var [win1, los1] = a.split("-").map(i => parseInt(i));
        var [win2, los2] = b.split("-").map(i => parseInt(i));
        if(los1 != los2) {
          return (los1 < los2 ? -1 : 1);
        }
        else {
          return (win1 < win2 ? 1 : -1);
        }
      });
      var updateObj = {};
      var league = Leagues.findOne(event.league);
      var totalScore = bracket.participants.length;

      var leaderboardIndex = league.events.indexOf(event.slug) + 1;
      league.leaderboard[leaderboardIndex].forEach((entry, localIndex) => {
        var negIndex = sortedKeys.findIndex(score => {
          return obj[score].findIndex(player => {
            return player.id == entry.id;
          }) >= 0;
        });
        if(negIndex < 0) {
          throw new Meteor.Error();
        }
        var globalIndex = league.leaderboard[0].findIndex((usr) => { return usr.id == entry.id });
        updateObj[`leaderboard.0.${globalIndex}.score`] = totalScore - negIndex;
        updateObj[`leaderboard.${leaderboardIndex}.${localIndex}.score`] = totalScore - negIndex;
      });
      Leagues.update(event.league, {
        $inc: updateObj
      });
    }

    Instances.update(instance._id, cmd);
  }
})
