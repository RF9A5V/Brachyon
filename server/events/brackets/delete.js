Meteor.methods({
  "brackets.delete"(id, format) {
    var bracket = Brackets.findOne(id);
    var matches = [];
    if(format == "single_elim" || format == "double_elim") {
      bracket.rounds.forEach(b => {
        b.forEach(r => {
          r.forEach(m => {
            if(m) {
              matches.push(m.id);
            }
          })
        })
      });
    }
    Brackets.remove(id);
    Matches.remove({
      _id: {
        $in: matches
      }
    })
  }
})
