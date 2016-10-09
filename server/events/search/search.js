import moment from "moment";

import { Images } from "/imports/api/event/images.js";

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
    "brackets": {
      $elemMatch: {
        game: gameId
      }
    }
  }
}

generateQuery["date"] = (dateObj) => {
  var dateString = dateObj.startDate.date;
  if(dateObj.startDate.time != null) {
    dateString += "T" + dateObj.startDate.time;
  }
  var start = moment(dateString).toDate();
  var end;
  if(dateObj.endDate.date != null){
    var end = dateObj.endDate.date;
    if(dateObj.endDate.time != null) {
      end += dateObj.endDate.time;
    }
    end = moment(end).toDate();
  }
  else {
    end = moment(dateString).endOf("day").toDate();
  }
  return {
    "details.datetime": {
      $gte: start,
      $lte: end
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
