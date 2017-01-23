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
    var bracketIds = [];
    bracketInstances.forEach(i => {
      i.brackets.forEach(b => {
        bracketIds.push(b.id);
      })
    });
    var brackets = Brackets.find({ _id: { $in: bracketIds } });

    brackets.forEach(bracket => {
      var pipes = {};
      var rounds = bracket.rounds.map((b, i) => {
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
            var winner = null;
            if(m.winner) {
              // Hacky but should work for short term since no collision between alias and username
              winner = {
                alias: m.winner,
                id: Meteor.users.findOne({ username: alias })
              }
            }
            var match = Matches.insert({ players, winner });
            obj.id = match;
            return obj;
          })
        })
      });
      Brackets.update(bracket._id, rounds);
    })
  }
})
