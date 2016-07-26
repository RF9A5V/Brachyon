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
    var participants = Array(10).fill("").map( (x, i) => { return i } );
    console.log(participants);

    var rounds = OrganizeSuite.singleElim(participants);
    console.log(rounds);

    Events.update(eventID, {
      $set: {
        active: true,
        rounds: rounds
      }
    })
  }

})
