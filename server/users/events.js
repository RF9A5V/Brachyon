import moment from "moment";

import Games from "/imports/api/games/games.js";

var getEvents = function(query, limit) {
  const events = Events.find(query, {
    fields: {
      _id: 1,
      "details.name": 1,
      "details.bannerUrl": 1,
      "details.datetime": 1,
      slug: 1,
      league: 1
    },
    sort: {
      "details.datetime": 1
    },
    limit
  }).fetch();
  return events.map(e => {
    return {
      name: e.details.name,
      bannerUrl: e.details.bannerUrl,
      slug: e.slug,
      date: e.details.datetime,
      type: "event",
      id: e._id,
      league: e.league
    }
  });
}

var getLeagues = function(query, limit) {
  const leagues = Leagues.find(query, {
    fields: {
      _id: 1,
      slug: 1,
      "details.name": 1,
      "details.datetime": 1,
      "details.bannerUrl": 1,
      events: 1
    },
    sort: {
      "details.datetime": 1
    },
    limit
  }).fetch().map(e => {
    var event = Events.findOne(e.events[0].id);
    return {
      name: e.details.name,
      date: event.details.datetime,
      bannerUrl: e.details.bannerUrl,
      slug: e.slug,
      type: "league",
      id: e._id
    }
  });
  return leagues;
}

var getQBs = function(query, limit) {
  return Instances.find(query, {
    fields: {
      _id: 1,
      slug: 1,
      "brackets.name": 1,
      "brackets.game": 1,
      "brackets.startedAt": 1,
      "brackets.slug": 1,
      "brackets.hash": 1
    }
  }).fetch().map(b => {
    return {
      name: b.name || (Games.findOne(b.brackets[0].game) || {}).name,
      date: b.brackets[0].startedAt || new Date(),
      type: "bracket",
      slug: b.brackets[0].slug,
      hash: b.brackets[0].hash,
      id: b._id
    }
  });
}

genQueries = function(args) {
  var [eventQuery, leagueQuery, bracketQuery] = [{}, {}, {}];
  eventQuery.league = null;
  if(args.date) {
    eventQuery["details.datetime"] = leagueQuery["details.datetime"] = bracketQuery["brackets.0.startedAt"] = {
      $lt: args.date
    };
  }
  if(args.type == "active") {
    eventQuery.published = true;
    eventQuery.isComplete = false;
    bracketQuery["brackets.0.inProgress"] = true;
  }
  else if(args.type == "completed") {
    eventQuery.isComplete = true;
    bracketQuery["brackets.0.inProgress"] = false;
  }
  else if(args.type == "unpublished") {
    eventQuery.isComplete = false;
  }
  else if(args.type == "leagues") {
    eventQuery = null;
    bracketQuery = null;
  }
  else if(args.type == "quick brackets") {
    eventQuery = null;
    leagueQuery = null;
  }
  return {
    events: eventQuery,
    leagues: leagueQuery,
    brackets: bracketQuery
  }
}

Meteor.methods({
  "users.getPlayerEvents"(username, limit, args) {
    const user = Meteor.users.findOne({
      username
    });
    const queries = genQueries(args);
    var events = [];
    var leagues = [];
    var brackets = [];
    if(queries.events) {
      const instances = Instances.find({
        "brackets.participants.id": user._id,
        owner: null
      }, {
        fields: {
          _id: 1
        }
      }).fetch();
      queries.events.instances = {
        $in: instances.map(i => { return i._id })
      }
      events = getEvents(queries.events, limit);
    }
    if(queries.leagues) {
      queries.leagues.leaderboard = {
        $elemMatch: {
          [`${Meteor.userId()}`]: {
            $ne: null
          }
        }
      };
      leagues = getLeagues(queries.leagues, limit);
    }
    if(queries.brackets) {
      queries.brackets["brackets.participants.id"] = user._id;
      queries.brackets["owner"] = {
        $ne: null
      };
      brackets = getQBs(queries.brackets, limit);
    }

    return leagues.concat(events).concat(brackets).sort((a, b) => {
      if(moment(a.date).isBefore(moment(b.date))) {
        return 1;
      }
      return -1;
    }).slice(0, limit);
  },
  "users.getOwnerEvents"(username, limit, args) {
    const user = Meteor.users.findOne({
      username
    });
    var queries = genQueries(args);
    var events = [];
    var leagues = [];
    var brackets = [];
    if(queries.events) {
      queries.events["owner"] = user._id;
      events = getEvents(queries.events, limit);
    }
    if(queries.leagues) {
      queries.leagues.owner = user._id;
      leagues = getLeagues(queries.leagues, limit);
    }
    if(queries.brackets) {
      queries.brackets.owner = user._id;
      brackets = getQBs(queries.brackets, limit);
    }
    leagues = leagues.concat(events).concat(brackets).sort((a, b) => {
      if(moment(a.date).isBefore(moment(b.date))) {
        return 1;
      }
      return -1;
    }).slice(0, limit);
    return leagues;
  }
})
