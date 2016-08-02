import OrganizeSuite from "./tournament_api.js";

Meteor.methods({
  "events.toggle_participation"(eventID, userID) {
    if(Events.findOne(eventID) == null){
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(Meteor.users.findOne(userID) == null){
      throw new Meteor.Error(404, "Couldn't find this user.");
    }
    var event = Events.findOne({
      _id: eventID,
      participants: {
        $in: [userID]
      }
    });
    if(event == null){
      Events.update(eventID, {
        $push: { participants: userID }
      });
    }
    else {
      Events.update(eventID, {
        $pull: { participants: userID }
      });
    }
  },

  "events.start_event"(eventID) {
    if(Events.findOne(eventID) == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var event = Events.findOne(eventID);
    var participants = Object.keys(event.participants).map( (key) => { return event.participants[key] } );

    var rounds = OrganizeSuite.singleElim(participants);
    console.log(rounds);

    Events.update(eventID, {
      $set: {
        active: true,
        rounds: rounds
      }
    })
  },

  "events.advance_match"(eventID, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
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
          [`rounds.${roundNumber}.${matchNumber}`]: match,
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
          [`rounds.${roundNumber}.${matchNumber}`]: match,
          [`rounds.${roundNumber + 1}.${Math.floor(matchNumber / 2)}`]: advMatch
        }
      })
    }
  }

})
