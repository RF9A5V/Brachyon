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
    //var participants = Object.keys(event.participants).map( (key) => { return event.participants[key] } );
    var participants = Array(10).fill("").map((_, i) => { return i });
    //var rounds = OrganizeSuite.singleElim(participants);
    var rounds = OrganizeSuite.doubleElim(participants);

    Events.update(eventID, {
      $set: {
        active: true,
        rounds: rounds
      }
    })
  },

  "events.advance_match"(eventID, bracket, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    var loser;
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var match = event.rounds[bracket][roundNumber][matchNumber];
    if(placement == 0) {
      match.winner = match.playerOne;
      loser = match.playerTwo;
    }
    else {
      match.winner = match.playerTwo;
      loser = match.playerOne;
    }
    if(roundNumber + 1 >= event.rounds[bracket].length){
      Events.update(eventID, {
        $set: {
          [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
          complete: true
        }
      })
    }
    else {
      var advMatch = (bracket == 1 && matchNumber%2==0) ? event.rounds[bracket][roundNumber + 1][matchNumber]:event.rounds[bracket][roundNumber + 1][Math.floor(matchNumber / 2)];
      if(matchNumber % 2 == 0){
        advMatch.playerOne = match.winner;
      }
      else {
        advMatch.playerTwo = match.winner;
      }
      if (bracket == 0 && match.losm != null)
      {
        var losMatch = event.rounds[1][match.losr][match.losm];
        console.log(match.losr + " and " + match.losm);
        if (losMatch.playerOne == null) losMatch.playerOne = loser;
        else losMatch.playerTwo = loser;
        var losr = match.losr, losm = match.losm;
        Events.update(eventID, {
          $set: {
            [`rounds.${1}.${losr}.${losm}`]: losMatch,
            [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
            [`rounds.${bracket}.${roundNumber + 1}.${Math.floor(matchNumber / 2)}`]: advMatch
          }
        })
      }
      else {
        Events.update(eventID, {
          $set: {
            [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
            [`rounds.${bracket}.${roundNumber + 1}.${Math.floor(matchNumber / 2)}`]: advMatch
          }
        })
      }
    }
  }

})
