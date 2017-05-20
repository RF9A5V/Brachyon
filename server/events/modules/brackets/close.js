import Instances from "/imports/api/event/instance.js";

var singlePlacement = (rounds) => {
  var placement = [];
  var finals = Matches.findOne(rounds[0].pop()[0].id);
  placement.push([finals.winner]);
  placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]])
  rounds[0].reverse().map(r => {
    var losers = [];
    r.map(m => Matches.findOne((m || {}).id)).forEach(m => {
      if(!m) return;
      losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
    });
    placement.push(losers);
  });
  return placement;
}

var doublePlacement = (rounds) => {
  var placement = [];
  var finals = rounds[2].map(m => {return Matches.findOne(m[0].id)});
  var last = finals[1] && finals[1].winner != null ? finals[1] : finals[0];
  placement.push([last.winner]);
  placement.push([last.winner.alias == last.players[0].alias ? last.players[1] : last.players[0]]);
  rounds[1].reverse().forEach(round => {
    var losers = [];
    round.map(m => Matches.findOne((m || {}).id)).forEach(m => {
      if(!m) return;
      losers.push(m.winner.alias == m.players[0].alias ? m.players[1] : m.players[0]);
    });
    if(losers.length > 0) {
      placement.push(losers);
    }
  });
  return placement;
}

var sortPlacement = (format, rounds) => {
  if(format == "single_elim"){
    return singlePlacement(rounds);
  }
  if(format == "double_elim") {
    return doublePlacement(rounds);
  }
}

Meteor.methods({
  "events.brackets.close"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    console.log(event)
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

    var ranking = {};
    var place = 0;
    var placement = sortPlacement(bracket.format.baseFormat, roundobj.rounds);
    for (var i = 0 ; i < placement.length ; i++){
      place+=1;
      for (var j=0 ; j < placement[i].length; j++){
        ranking[placement[i][j].alias] = place;
      }
      place+=placement[i].length-1;
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
        if (Events.findOne(eventID)){
          var r = wins+"-"+loss
          var rank = ranking[player.alias];
          Meteor.users.update(player.id,{$push: {tournaments:{ eventName:Events.findOne(eventID).slug,game:bracket.game,record:r, ranking:rank }}});
        }
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
      var placement = sortPlacement(bracket.format.baseFormat, roundobj.rounds);

      var updateObj = {};
      var league = Leagues.findOne(event.league);
      var totalScore = bracket.participants.length;

      var leaderboardIndex = league.events.findIndex(e => {return e.slug == event.slug});
      var leaderboard = league.leaderboard[leaderboardIndex];
      Object.keys(leaderboard).forEach(id => {
        var negIndex = placement.findIndex(rank => {
          return rank.findIndex(player => {
            return player.id == id;
          }) >= 0;
        });
        updateObj[`leaderboard.${leaderboardIndex}.${id}.score`] = totalScore - negIndex;
      })
      Leagues.update(event.league, {
        $set: updateObj
      });
    }

    Instances.update(instance._id, cmd);
  },
  "leagues.leaderboard.setBonusByPlacement"(id, index, points, rank) {
    const league = Leagues.findOne(id);
    const event = Events.findOne({slug: league.events[index]});
    const instance = Instances.findOne(event.instances[event.instances.length - 1]);
    const bracket = Brackets.findOne(instance.brackets[0].id);
    var placement = sortPlacement(instance.brackets[0].format.baseFormat, bracket.rounds);
    var updateObj = {};
    placement[rank].forEach(p => {
      updateObj[`leaderboard.${index}.${p.id}.bonus`] = points;
    });
    Leagues.update(id, {
      $set: updateObj
    });
  }
})
