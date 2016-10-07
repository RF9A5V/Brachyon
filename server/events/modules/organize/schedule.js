Meteor.methods({
  "events.organize.schedule.addDay"(id) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $push: {
        "organize.schedule": []
      }
    })
  },
  "events.organize.schedule.deleteDay"(id, index) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $unset: {
        [`organize.schedule.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        [`organize.schedule`]: null
      }
    })
  },
  "events.organize.schedule.addTime"(id, index, time) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    var days = event.organize.schedule;
    var timeToComp = (time) => {
      var comps = time.split(":");
      var [hour, minutes, half] = [parseInt(comps[0]), parseInt(comps[1].slice(0, 2)), comps[1].slice(2)];
      if(hour == 12 && half == "AM") {
        hour = 0;
      }
      if(hour < 12 && half == "PM") {
        hour += 12;
      }
      return [hour, minutes];
    }
    var [hour, minutes] = timeToComp(time);
    var pos = days[index].length;
    for(var i = 0; i < pos; i ++){
      if(time == days[index][i].time) {
        throw new Meteor.Error(403, "Time already exists.");
      }
      var [testHour, testMinutes] = timeToComp(days[index][i].time);
      if(hour < testHour || (hour == testHour && minutes < testMinutes)) {
        pos = i;
        break;
      }
    }
    Events.update(id, {
      $push: {
        [`organize.schedule.${index}`]: {
          $each: [{
            time
          }],
          $position: pos
        }
      }
    });
  },
  "events.organize.schedule.deleteTime"(id, dayIndex, index) {
    var event = Events.findOne(id);
    if(!event){
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $unset: {
        [`organize.schedule.${dayIndex}.${index}`]: 1
      }
    });
    Events.update(id, {
      $pull: {
        [`organize.schedule.${dayIndex}`]: null
      }
    })
  },
  "events.organize.schedule.updateTime"(id, dayIndex, index, title, description) {
    var event = Events.findOne(id);
    if(!event) {
      throw new Meteor.Error(404, "Event not found.");
    }
    Events.update(id, {
      $set: {
        [`organize.schedule.${dayIndex}.${index}.title`]: title,
        [`organize.schedule.${dayIndex}.${index}.description`]: description
      }
    })
  }
})
