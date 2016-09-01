import moment from "moment";

var generateQuery = {};

generateQuery["name"] = (name) => {
  return {
    "details.name": new RegExp(name.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i')
  }
}

generateQuery["location"] = (locObj) => {
  var currentObj = {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: locObj.coords.reverse() // Necessary, because of how MongoDB does the calculations.
      },
      $maxDistance: locObj.distance * 1609 || 16093
    }
  };
  return {
    "details.location.coords": currentObj
  }
}

generateQuery["game"] = (gameId) => {
  return {
    "organize": {
      $elemMatch: {
        game: gameId
      }
    }
  }
}

generateQuery["date"] = (dateObj) => {
  var dateString = dateObj.date;
  if(dateObj.time != null) {
    dateString += "T" + dateObj.time;
  }
  var start = moment(dateString).toDate();
  var end = moment(dateString).endOf("day").toDate();
  return {
    "details.datetime": {
      $gte: start,
      $lt: end
    }
  }
}

Meteor.methods({
  "events.search"(params) {
    var query = {};
    for(var i in params){
      if(params[i] == "" || params[i] == null){
        continue;
      }
      var cmd = generateQuery[i](params[i]);
      for(var j in cmd){
        query[j] = cmd[j];
      }
    }
    query["published"] = true;
    console.log(query);
    return query;
  }
})
