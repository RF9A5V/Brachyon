Meteor.methods({
  "events.sponsor"(id, amount) {
    var event = Events.findOne(id);
    var user = Meteor.users.findOne(Meteor.userId());
    if(!event){
      throw new Meteor.Error(404, "Event not found!");
    }
    if(user.profile.amount < amount) {
      throw new Meteor.Error(403, "You lack the required funds to sponsor this event.");
    }
    Events.update(id, {
      $inc: {
        [`sponsors.${Meteor.userId()}`]: amount
      }
    });
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.amount": -amount
      }
    })
  }
})
