Meteor.methods({
  "events.create"(obj) {
    if(obj.details == null){
      throw new Meteor.error(403, "Needs details for this object");
    }
    Meteor.call("events.updateDetails", obj.details);
  },
  "events.updateDetails"(detailsObject) {
    if(detailsObject == null){
      return true;
    }
    var predefinedKeys = [
      "name",
      "location",
      "description",
      "startDate",
      "startTime"
    ].sort((a, b) => {
      return a < b;
    });
    var suppliedKeys = Object.keys(detailsObject).sort((a, b) => {
      return a < b;
    });
    var intersection = [];
    while(predefinedKeys.length > 0 && suppliedKeys.length > 0){
      var i = predefinedKeys.length - 1;
      var j = suppliedKeys.length - 1;
      if(predefinedKeys[i] == suppliedKeys[j]) {
        intersection.push(predefinedKeys[i]);
        predefinedKeys.pop();
        suppliedKeys.pop();
      }
      else if(predefinedKeys[i] < suppliedKeys[i]) {
        predefinedKeys.pop();
      }
      else {
        suppliedKeys.pop();
      }
    }
    console.log(intersection);
    var withinParams = {};
    for(var i in intersection){
      withinParams[intersection[i]] = detailsObject[intersection[i]];
    }
    return withinParams;
  }
})
