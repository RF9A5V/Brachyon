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

    const match = Matches.findOne(id);
    const playerIds = match.players.map(p => { return p.id });
    // Notifications for users go here!
    Meteor.call("messages.notifyAll", playerIds, "Your match has started! Go ahead and start playing, and remember to tell the TO your score after you finish!");

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
    const match = Matches.findOne(id);
    value = value || null;
    if(value) {
      var text = "";
      if(match.status == 1) {
        text = `When your match starts, please play at Station ${value}.`;
      }
      else {
        text = `Also, please play at Station ${value}.`;
      }
      Meteor.call("messages.notifyAll", match.players.map(p => { return p.id }), text);
    }
    Matches.update(id, {
      $set: {
        station: value
      }
    })
  }
})
