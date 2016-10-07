Meteor.methods({
  "events.crowdfunding.saveDetails"(id, amount, dueDate){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "crowdfunding.details.amount": amount,
        "crowdfunding.details.dueDate": dueDate
      }
    })
  }
})
