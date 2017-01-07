import moment from "moment";

Meteor.methods({
  "events.submit"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    if(event.crowdfunding) {
      var cfDate = moment(event.crowdfunding.details.dueDate);
      var startDate = moment(event.details.datetime);
      if(cfDate.isAfter(startDate.subtract(5, "days"))) {
        throw new Meteor.Error(403, "Crowdfunding due date must be at least five days before event start date!");
      }
      Events.update(id, {
        $set: {
          underReview: true,
          published: false
        }
      })
    }
    else {
      Events.update(id, {
        $set: {
          published: true
        }
      })
    }
  }
})
