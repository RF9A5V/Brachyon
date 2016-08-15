Meteor.methods({
  "events.updateModules"(eventID, modules) {
    var eventCheck = Events.findOne(eventID);
    if(eventCheck == null) {
      throw new Meteor.Error(404, "Event not found.");
    }

    var event = {};
    ["revenue", "promotion", "organize", "bot"].forEach((value) => {
      if(eventCheck[value] != null) {
        event[value] = {
          keys: Object.keys(eventCheck[value]),
          modified: false
        }
      }
    });

    for(var i in modules) {
      if(event[i] == null) {
        continue;
      }
      if(modules[i].length == 0) {
        delete modules[i];
        delete event[i];
        continue;
      }
      var subModules = modules[i].slice();
      var eventModules = event[i].keys || [];
      for(var j in modules[i]) {
        var key = modules[i][j];
        if(subModules.indexOf(key) >= 0 && eventModules.indexOf(key) >= 0) {
          subModules.splice(subModules.indexOf(key), 1);
          eventModules.splice(eventModules.indexOf(key), 1);
        }
      }
      event[i].modified = true;
      if(subModules.length == 0){
        delete modules[i];
      }
      if(eventModules.length == 0) {
        delete event[i];
      }
    }
    for(var i in event) {
      if(!event[i].modified) {
        event[i] = [];
      }
      else {
        event[i] = event[i].keys;
      }
    }

    var toSet = {};
    var toUnset = {};

    for(var i in modules) {
      if(modules[i].length == 0){
        toSet[i] = {};
      }
      else {
        for(var j in modules[i]) {
          toSet[i + "." + modules[i][j]] = true;
        }
      }
    }

    for(var i in event) {
      if(event[i].length == 0){
        toUnset[i] = 1;
      }
      else {
        for(var j in event[i]) {
          toUnset[i + "." + event[i][j]] = 1;
        }
      }
    }

    var updateObj = {};
    if(Object.keys(toSet).length > 0) {
      updateObj["$set"] = toSet;
    }
    if(Object.keys(toUnset).length > 0) {
      updateObj["$unset"] = toUnset;
    }
    if(Object.keys(updateObj).length > 0) {
      Events.update(eventID, updateObj);
    }
  }
})
