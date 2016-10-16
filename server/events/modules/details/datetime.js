import moment from "moment";

Meteor.methods({
  "events.details.datetimeSave"(id, dateObj) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.")
    }
    var currentDate = moment().minute(0).second(0).millisecond(0);
    var startDate = moment(dateObj).minute(0).second(0).millisecond(0);
    if(startDate.isBefore(currentDate) && !startDate.isSame(currentDate)) {
      throw new Meteor.Error(403, "Event start date cannot be before current date.");
    }
    Events.update(id, {
      $set: {
        "details.datetime": dateObj
      }
    })
  }
})
