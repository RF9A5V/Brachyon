import OrganizeSuite from "./tournament_api.js";

Meteor.methods({
  "events.toggle_participation"(eventID, userID, bracketNumber) {
    if(Events.findOne(eventID) == null){
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(Meteor.users.findOne(userID) == null){
      throw new Meteor.Error(404, "Couldn't find this user.");
    }
    var event = Events.findOne({
      _id: eventID,
      [`organize.${bracketNumber}.participants`]: {
        $in: [userID]
      }
    });
    if(event == null){
      Events.update(eventID, {
        $push: {
          [`organize.${bracketNumber}.participants`]: userID
        }
      });
    }
    else {
      Events.update(eventID, {
        $pull: {
          [`organize.${bracketNumber}.participants`]: userID
        }
      });
    }
  },

  "events.start_event"(eventID) {
    if(Events.findOne(eventID) == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var event = Events.findOne(eventID);

    var rounds = OrganizeSuite.singleElim(event.organize[0].participants);
    console.log(rounds);

    Events.update(eventID, {
      $set: {
        active: true,
        "organize.0.rounds": rounds
      }
    })
  },

  "events.advance_match"(eventID, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.organize[0];
    var match = event.rounds[roundNumber][matchNumber];
    if(placement == 0) {
      match.winner = match.playerOne;
    }
    else {
      match.winner = match.playerTwo;
    }
    if(roundNumber + 1 >= event.rounds.length){
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${roundNumber}.${matchNumber}`]: match,
          complete: true
        }
      })
    }
    else {
      var advMatch = event.rounds[roundNumber + 1][Math.floor(matchNumber / 2)];
      if(matchNumber % 2 == 0){
        advMatch.playerOne = match.winner;
      }
      else {
        advMatch.playerTwo = match.winner;
      }
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${roundNumber}.${matchNumber}`]: match,
          [`organize.0.rounds.${roundNumber + 1}.${Math.floor(matchNumber / 2)}`]: advMatch
        }
      })
    }
  }

})
