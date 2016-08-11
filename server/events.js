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
    var participants = Array(16).fill("").map((_, i) => { return i });
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

    if (bracket == 0 && match.losm != null)
    {
      var losMatch = event.rounds[1][match.losr][match.losm];
      if (losMatch.playerOne == null) losMatch.playerOne = loser;
      else losMatch.playerTwo = loser;
      var losr = match.losr, losm = match.losm;
      Events.update(eventID, {
        $set: {
          [`rounds.${1}.${losr}.${losm}`]: losMatch
        }
      })
    }

    if((roundNumber + 1 >= event.rounds[bracket].length && event.rounds.length == 1) || (bracket == 2 && (match.playerOne == match.winner || (roundNumber == 1)))){
      if (event.rounds.length == 1 || bracket == 2)
      {
        Events.update(eventID, {
          $set: {
            [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
            complete: true
          }
        })
      }
    }

    else if (roundNumber + 1 >= event.rounds[bracket].length){
      advMatch = event.rounds[2][0][0];
      if (bracket == 0) advMatch.playerOne = match.winner;
      else advMatch.playerTwo = match.winner;
      Events.update(eventID, {
        $set: {
          [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
          [`rounds.${2}.${0}.${0}`]: advMatch
        }
      })
    }

    else {
      var advMN = (bracket > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
      var advMatch = event.rounds[bracket][roundNumber + 1][advMN];
      if (bracket == 0 || roundNumber%2 == 1)
      {
        if(matchNumber % 2 == 0){
          advMatch.playerOne = match.winner;
        }
        else {
          advMatch.playerTwo = match.winner;
        }
      }
      else if (bracket == 2)
      {
        advMatch.playerOne = match.playerOne;
        advMatch.playerTwo = match.playerTwo;
      }
      else
      {
        if (advMatch.playerTwo == null) advMatch.playerTwo = match.winner;
        else advMatch.playerOne = match.winner;
      }
      Events.update(eventID, {
        $set: {
          [`rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
          [`rounds.${bracket}.${roundNumber + 1}.${advMN}`]: advMatch
        }
      })
    }
  }

})
