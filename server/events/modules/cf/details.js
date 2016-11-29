import moment from "moment";

Meteor.methods({
  "events.crowdfunding.saveDetails"(id, amount, dueDate){
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(amount < 0) {
      throw new Meteor.Error(403, "Can't use a negative number for crowdfunding!");
    }
    var eventStartDate = moment(event.details.datetime).hour(0).minute(0).second(0).millisecond(0);
    var date = moment(dueDate).hour(0).minute(0).second(0).millisecond(0);

    date.dayOfYear(date.dayOfYear() + 5);

    if(!date.isAfter(eventStartDate)) {
      throw new Meteor.Error(403, "Cannot crowdfund event unless due date is at least five days before event start!");
    }

    Events.update(id, {
      $set: {
        "crowdfunding.details.amount": amount,
        "crowdfunding.details.dueDate": dueDate
      }
    })
  }
})
