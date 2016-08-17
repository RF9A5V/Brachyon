import OrganizeSuite from "./tournament_api.js";

Meteor.methods({

  "events.addParticipant"(eventID, bracketIndex, userID, alias, email) {
    var event = Events.findOne(eventID);

    if(alias == "" || alias == null) {
      throw new Meteor.Error(403, "Alias for a participant has to exist.");
    }
    if(event == null) {
      throw new Meteor.Error(404, "Couldn't find this event.");
    }
    if(event.organize == null || event.organize[bracketIndex] == null) {
      throw new Meteor.Error(404, "Couldn't find this bracket.");
    }
    var bracket = event.organize[bracketIndex];

    var bracketContainsAlias = (bracket.participants || []).some((player) => {
      return player.alias.toLowerCase() == alias.toLowerCase();
    });

    if(bracketContainsAlias) {
      throw new Meteor.Error(403, "Someone is already using this alias. Choose another one.");
    }
    if(userID != null) {
      // User participant being added.
      var user = Meteor.users.findOne(userID);
      if(user == null) {
        throw new Meteor.Error(404, "User not found.");
      }
      var bracketContainsUser = (bracket.participants || []).some((player) => {
        return player.id == userID;
      });
      if(bracketContainsUser) {
        throw new Meteor.Error(403, "User is already registered for this bracket.");
      }
      var emailMatch = user.emails.some((emailObj) => {
        return emailObj.address == email;
      })
      if(!emailMatch) {
        throw new Meteor.Error(403, "Invalid email for verification.");
      }
    }
    Events.update(eventID, {
      $push: {
        [`organize.${bracketIndex}.participants`]: {
          id: userID,
          alias
        }
      }
    })
  },

  "events.removeParticipant"(eventID, bracketIndex, participantIndex) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bracket = event.organize[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    if(bracket.participants == null || bracket.participants.length <= participantIndex) {
      throw new Meteor.Error(404, "Participant not found.");
    }
    Events.update(eventID, {
      $unset: {
        [`organize.${bracketIndex}.participants.${participantIndex}`]: 1
      }
    });
    Events.update(eventID, {
      $pull: {
        [`organize.${bracketIndex}.participants`]: null
      }
    })
  },

  "events.registerUser"(eventID, bracketIndex) {
    var event = Events.findOne(eventID);
    if(event == null) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var bracket = event.organize[bracketIndex];
    if(bracket == null) {
      throw new Meteor.Error(404, "Bracket not found.");
    }
    var user = Meteor.user();
    var alias = user.profile.alias || user.username;
    var bracketContainsUser = (bracket.participants || []).some((player) => {
      return player.id == user._id;
    });
    if(bracketContainsUser) {
      throw new Meteor.Error(403, "User is already registered for this bracket.");
    }
    var bracketContainsAlias = (bracket.participants || []).some((player) => {
      return player.alias.toLowerCase() == alias.toLowerCase();
    });
    if(bracketContainsAlias) {
      throw new Meteor.Error(403, "Someone is already using this alias. Choose another one or talk to your friendly neighborhood tournament organizer.");
    }
    Events.update(eventID, {
      $push: {
        [`organize.${bracketIndex}.participants`]: {
          id: user._id,
          alias
        }
      }
    })
  },

  "events.start_event"(eventID) {
    if(Events.findOne(eventID) == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var organize = Events.findOne(eventID).organize[0];
    var format = Events.findOne(eventID).organize[0].format.baseFormat;
    if (format == "single_elim")
      var rounds = OrganizeSuite.singleElim(organize.participants.map(function(participant) {
        return participant.alias;
      }));
    else
      var rounds = OrganizeSuite.doubleElim(organize.participants.map(function(participant) {
        return participant.alias;
      }));

    Events.update(eventID, {
      $set: {
        active: true,
        "organize.0.rounds": rounds
      }
    })
  },

  "events.advance_match"(eventID, bracketNumber, roundNumber, matchNumber, placement) {
    var event = Events.findOne(eventID);
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.organize[0];
    var loser;
    var match = event.rounds[bracketNumber][roundNumber][matchNumber];
    if (match.winner != null || match.playerOne == null || match.playerTwo == null)
      return false;
    if(placement == 0) {
      match.winner = match.playerOne;
      loser = match.playerTwo;
    }
    else {
      match.winner = match.playerTwo;
      loser = match.playerOne;
    }

    if (bracketNumber == 0 && match.losm != null)
    {
      var losMatch = event.rounds[1][match.losr][match.losm];
      if (losMatch.playerOne == null) losMatch.playerOne = loser;
      else losMatch.playerTwo = loser;
      var losr = match.losr, losm = match.losm;
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${1}.${losr}.${losm}`]: losMatch
        }
      })
    }

    if((roundNumber + 1 >= event.rounds[bracketNumber].length && event.rounds.length == 1) || (bracketNumber == 2 && (match.playerOne == match.winner || (roundNumber == 1)))){
      if (event.rounds.length == 1 || bracketNumber == 2)
      {
        Events.update(eventID, {
          $set: {
            [`organize.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
            complete: true
          }
        })
      }
    }

    else if (roundNumber + 1 >= event.rounds[bracketNumber].length){
      advMatch = event.rounds[2][0][0];
      if (bracketNumber == 0) advMatch.playerOne = match.winner;
      else advMatch.playerTwo = match.winner;
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`organize.0.rounds.${2}.${0}.${0}`]: advMatch
        }
      })
    }

    else {
      var advMN = (bracketNumber > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
      var advMatch = event.rounds[bracketNumber][roundNumber + 1][advMN];
      if (bracketNumber == 0 || roundNumber%2 == 1)
      {
        if(matchNumber % 2 == 0){
          advMatch.playerOne = match.winner;
        }
        else {
          advMatch.playerTwo = match.winner;
        }
      }
      else if (bracketNumber == 2)
      {
        advMatch.playerOne = match.playerOne;
        advMatch.playerTwo = match.playerTwo;
      }
      else
      {
        advMatch.playerTwo = match.winner;
      }
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match,
          [`organize.0.rounds.${bracketNumber}.${roundNumber + 1}.${advMN}`]: advMatch
        }
      })
    }
  },

  "events.undo_match"(eventID, bracketNumber, roundNumber, matchNumber) {
    var event = Events.findOne(eventID);
    if (!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.organize[0];
    match = event.rounds[bracketNumber][roundNumber][matchNumber];
    var advMN = (bracketNumber > 0 && roundNumber%2==0) ? matchNumber:Math.floor(matchNumber / 2);
    var [fb, fr, fm] = [bracketNumber, roundNumber+1, advMN];
    if (fr >= event.rounds[bracketNumber].length)
      var [fb, fr, fm] = bracketNumber == 2 ? [2, 1, 0]:[2, 0, 0];
    if (bracketNumber == 2 && roundNumber == 1)
    {
      match.winner = null;
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${2}.${1}.${0}`]: match
        }
      });
      return;
    }
    var advMatch = event.rounds[fb][fr][fm];
    if (advMatch.winner)
    {
      Meteor.call("events.undo_match", eventID, fb, fr, fm);
      event = Events.findOne(eventID).organize[0];
      advMatch = event.rounds[fb][fr][fm];
      match = event.rounds[bracketNumber][roundNumber][matchNumber];
    }
    if (event.rounds.length > 1 && bracketNumber == 0)
    {
      loser = match.winner == match.playerOne ? (match.playerTwo):(match.playerOne);
      loserround = event.rounds[1][match.losr][match.losm];
      if (loserround.winner != null)
      {
        Meteor.call("events.undo_match", eventID, 1, match.losr, match.losm);
        event = Events.findOne(eventID).organize[0];
        advMatch = event.rounds[fb][fr][fm];
        match = event.rounds[bracketNumber][roundNumber][matchNumber];
        loserround = event.rounds[1][match.losr][match.losm];
      }
      if (loserround.playerOne == loser) loserround.playerOne = null;
      else loserround.playerTwo = null;
      Events.update(eventID, {
        $set: {
          [`organize.0.rounds.${1}.${match.losr}.${match.losm}`]: loserround
        }
      });
    }
    match.winner = null;
    if (roundNumber >= event.rounds[bracketNumber].length-1)
    {
      if (bracketNumber == 0)
        advMatch.playerOne = null;
      else
        advMatch.playerTwo = null;
    }
    else if (bracketNumber == 0 || roundNumber%2 == 1)
    {
      if(matchNumber % 2 == 0){
        advMatch.playerOne = null;
      }
      else {
        advMatch.playerTwo = null;
      }
    }
    else if (bracketNumber == 2)
    {
      advMatch.playerOne = null;
      advMatch.playerTwo = null;
    }
    else
    {
      advMatch.playerTwo = null;
    }
    Events.update(eventID, {
      $set: {
        [`organize.0.rounds.${fb}.${fr}.${fm}`]: advMatch,
        [`organize.0.rounds.${bracketNumber}.${roundNumber}.${matchNumber}`]: match
      }
    })
    return;
  }

})
