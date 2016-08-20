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

  "events.start_event"(eventID, format) {
    if(Events.findOne(eventID) == null) {
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    var organize = Events.findOne(eventID).organize[0];
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

  "events.advance_match"(eventID, bracket, roundNumber, matchNumber, placement) {
    console.log("we in there bois");
    var event = Events.findOne(eventID);
    var loser;
    if(!event){
      throw new Meteor.Error(404, "Couldn't find this event!");
    }
    event = event.organize[0];
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
          [`organize.0.rounds.${1}.${losr}.${losm}`]: losMatch
        }
      })
    }

    if((roundNumber + 1 >= event.rounds[bracket].length && event.rounds.length == 1) || (bracket == 2 && (match.playerOne == match.winner || (roundNumber == 1)))){
      if (event.rounds.length == 1 || bracket == 2)
      {
        Events.update(eventID, {
          $set: {
            [`organize.0.rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
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
          [`organize.0.rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
          [`organize.0.rounds.${2}.${0}.${0}`]: advMatch
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
          [`organize.0.rounds.${bracket}.${roundNumber}.${matchNumber}`]: match,
          [`organize.0.rounds.${bracket}.${roundNumber + 1}.${advMN}`]: advMatch
        }
      })
    }
  },

  "events.updateMatchFromDiscordID"(discordID, eventID){
    var alias = null;
    var user = Meteor.users.findOne({"services.discord.id": discordID});
    var event = Events.findOne(eventID);

    if(!user){
      throw new Meteor.Error(404, "User not found");
    }

    if(!event){
      throw new Meteor.Error(404, "Event not found");
    }

    var bracket = event.organize[0]

    for(var participant = bracket.participants.length - 1; participant >= 0; participant--){
      if(user._id == bracket.participants[participant].id){
        alias = bracket.participants[participant].alias;
      }
    }

    for(var bracketNumber = bracket.rounds.length - 1; bracketNumber >= 0; bracketNumber--){
      for(var roundNumber = bracket.rounds[bracketNumber].length - 1; roundNumber >= 0; roundNumber--){
        for(var matchNumber = bracket.rounds[bracketNumber][roundNumber].length - 1; matchNumber >= 0; matchNumber--){
          if(bracket.rounds[bracketNumber][roundNumber][matchNumber].playerOne != null){
            if(alias == bracket.rounds[bracketNumber][roundNumber][matchNumber].playerOne){
              Meteor.call("events.advance_match", eventID, bracketNumber, roundNumber, matchNumber, 0,function(err){
                if(err){
                  throw new Meteor.Error(404, "Match not updated");
                }
              });

              return;
            }
            else if(alias == bracket.rounds[bracketNumber][roundNumber][matchNumber].playerTwo){
              Meteor.call("events.advance_match", eventID, bracketNumber, roundNumber, matchNumber, 1,function(err){
                if(err){
                  throw new Meteor.Error(404, "Match not updated");
                }
              });

              return;
            }
          }
        }
      }
    }
  }

})
