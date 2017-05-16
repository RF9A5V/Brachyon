Meteor.methods({
  "matches.updateScore"(id, index, isInc) {
    var match = Matches.findOne(id);
    if(!match){
      throw new Meteor.Error(404, "Match not found!");
    }
    Matches.update(id, {
      $inc: {
        [`players.${index}.score`]: isInc ? 1 : -1
      }
    });
  },
  "match.start"(id) {
    Matches.update(id, {
      $set: {
        status: 2,
        startedAt: new Date()
      }
    })
  },
  "match.unstart"(id) {
    Matches.update(id, {
      $set: {
        status: 1,
        startedAt: null
      }
    })
  },
  "match.toggleStream"(id) {
    const match = Matches.findOne(id);
    Matches.update(id, {
      $set: {
        stream: !match.stream
      }
    })
  },
  "match.setStation"(id, value) {
    value = value || null;
    Matches.update(id, {
      $set: {
        station: value
      }
    })
  }
})
