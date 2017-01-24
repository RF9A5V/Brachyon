import Matches from "/imports/api/event/matches.js";
import OrganizeSuite from "/server/tournament_api.js";

Migrations.add({
  version: 2,
  up: function() {
    var bracketInstances = Instances.find({
      "brackets.id": {
        $ne: null
      },
      $or: [
        {
          "brackets.format.baseFormat": "single_elim"
        },
        {
          "brackets.format.baseFormat": "double_elim"
        }
      ]
    });
    console.log(bracketInstances.fetch().length);
    bracketInstances.forEach(i => {
      i.brackets.forEach(idContainer => {
        var bracket = Brackets.findOne(idContainer.id);
        if(bracket) {
          var format = idContainer.format.baseFormat;
          var rounds;
          if(format == "single_elim") {
            rounds = OrganizeSuite.singleElim(idContainer.participants);
          }
          else if(format == "double_elim") {
            rounds = OrganizeSuite.doubleElim(idContainer.participants);
          }
          rounds.forEach((b, i) => {
            b.forEach((r, j) => {
              r.forEach((m, k) => {
                var oldMatch = bracket.rounds[i][j][k];
                var obj = {};
                if(oldMatch.winner) {
                  var user = Meteor.users.findOne({username: oldMatch.winner});
                  obj.winner = { alias: oldMatch.winner, id: user ? user._id : null };
                }
                var players = [];
                players.push(m.playerOne ? { alias: m.playerOne.alias, id: m.playerOne.id, score: 0 } : null);
                players.push(m.playerTwo ? { alias: m.playerTwo.alias, id: m.playerTwo.id, score: 0 } : null);
                var mObj = Matches.insert({
                  players
                });
                Brackets.update(bracket._id, {
                  $unset: {
                    [`rounds.${i}.${j}.${k}.playerOne`]: 1,
                    [`rounds.${i}.${j}.${k}.playerTwo`]: 1,
                    [`rounds.${i}.${j}.${k}.scoreOne`]: 1,
                    [`rounds.${i}.${j}.${k}.scoreTwo`]: 1
                  },
                  $set: {
                    [`rounds.${i}.${j}.${k}.id`]: mObj,
                    winner: obj.winner
                  }
                });
                Meteor.call("events.advance_" + (format == "single_elim" ? "single" : "double"), bracket._id, i, j, k);
              })
            })
          })
        }
      })
    });
  }
})
