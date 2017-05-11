const getTopPlayers = (id, num) => {
  num = num || 4;
  var rounds = Brackets.findOne(id).rounds;
  var placement = [];
  var content;
  if(rounds.length == 1) {
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
  }
  else if(rounds.length == 3) {
    var finals = rounds[2].map(m => {return Matches.findOne(m[0].id)});
    finals = finals[1] && finals[1].winner != null ? finals[1] : finals[0];
    placement.push([finals.winner]);
    placement.push([finals.winner.alias == finals.players[0].alias ? finals.players[1] : finals.players[0]])
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
  }
  var topN = [];
  for(var i = 0; i < placement.length; i ++) {
    topN = topN.concat(placement[i]);
  }
  return topN.slice(0, num);
}

export { getTopPlayers }
