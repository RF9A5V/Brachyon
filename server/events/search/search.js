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
    return query;
  }
})
