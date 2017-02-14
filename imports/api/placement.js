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

export { sortPlacement }
