var safeParams = (object, fields) => {
  if(object == null){
    throw new Meteor.error(403, "Object can't be undefined.");
  }
  fields = fields.sort((a, b) => {
    return a < b;
  });
  var params = Object.keys(object).sort((a, b) => {
    return a < b;
  })
  var intersect = [];
  while(fields.length > 0 && params.length > 0) {
    var [i, j] = [fields.length - 1, params.length - 1];
    if(fields[i] == params[j]) {
      intersect.push(fields[i]);
      fields.pop();
      params.pop();
    }
    else if(fields[i] < params[j]) {
      fields.pop();
    }
    else {
      params.pop();
    }
  }
  var safeOutput = {};
  for(var i in intersect) {
    safeOutput[intersect[i]] = object[intersect[i]];
  }
  return safeOutput;
}

Meteor.methods({
  "events.create"(obj) {
    if(obj.details == null){
      throw new Meteor.error(403, "Needs details for this object");
    }

    console.log(obj);

    var main = {
      published: true,
      underReview: false,
      active: false,
      complete: false,
      owner: Meteor.userId()
    };

    var details = Meteor.call("events.updateDetails", obj.details);
    var nonReview = ["brackets", "bot"];
    var review = ["revenue", "promotion"];
    var requiresReview = false;

    main["details"] = details;
    var attrKeys = Object.keys(obj);

    for(var i in attrKeys) {
      var key = attrKeys[i];
      if(nonReview.indexOf(key) >= 0) {
        main[key] = obj[key];
      }
      else if(review.indexOf(key) >= 0) {
        requiresReview = true;
        main[key] = obj[key];
      }
    }
    if(requiresReview){
      main.published = false;
      main.underReview = false;
    }
    return Events.insert(main);
  },
  "events.updateDetails"(detailsObject) {
    if(detailsObject == null){
      throw new Meteor.Error(403, "Details are required.");
    }
    var predefinedKeys = [
      "name",
      "location",
      "description",
      "datetime"
    ].sort((a, b) => {
      return a < b;
    });
    return safeParams(detailsObject, predefinedKeys);
  }
})
