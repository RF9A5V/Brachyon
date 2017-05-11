const isComplete = (id) => {
  const bracket = Brackets.findOne(id);
  if(bracket.rounds) {
    if(bracket.rounds.length == 1) {
      const id = bracket.rounds.pop().pop().pop().id;
      const finMatch = Matches.findOne(id);
      return finMatch.winner != null;
    }
    else {
      const finMatch = Matches.findOne(bracket.rounds[2][1][0].id);
      if(!finMatch.winner) {
        const prevMatch = Matches.findOne(bracket.rounds[2][0][0].id);
        return prevMatch.winner != null;
      }
      else {
        return true;
      }
    }
  }
  return false;
}

export { isComplete };
