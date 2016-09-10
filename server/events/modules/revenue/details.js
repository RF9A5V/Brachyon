Meteor.methods({
  "events.revenue.saveDetails"(id, amount, dueDate){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        "revenue.amount": amount,
        "revenue.dueDate": dueDate
      }
    })
  }
})
