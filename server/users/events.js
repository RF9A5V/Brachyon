import moment from "moment";

Meteor.methods({
  "users.getPlayerEvents"(username, limit, args) {
    const user = Meteor.users.findOne({
      username
    });
    const instances = Instances.find({
      "brackets.participants.id": user._id
    }, {
      fields: {
        _id: 1
      }
    }).fetch();
    var queryObj = {
      instances: {
        $in: instances.map(i => { return i._id })
      },
      "details.datetime": {
        $lt: args.date
      }
    }
    switch(args.type) {
      case "active":
        queryObj.published = true;
        queryObj.isComplete = false;
        break;
      case "completed":
        queryObj.isComplete = true;
        break;
      case "unpublished":
        queryObj.published = false;
        break;
      default:
        break;
    }
    const events = Events.find(queryObj, {
      fields: {
        _id: 1,
        "details.name": 1,
        "details.bannerUrl": 1,
        "details.datetime": 1,
        slug: 1,
        league: 1
      },
      sort: {
        "details.datetime": -1
      },
      limit
    }).fetch().map(e => {
      return {
        name: e.details.name,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        date: e.details.datetime,
        type: "event",
        id: e._id,
        isLeague: e.league != null
      }
    });
    return events;
  },
  "users.getOwnerEvents"(username, limit, args) {
    const user = Meteor.users.findOne({
      username
    });
    var queryObj = {
      owner: user._id,
      "details.datetime": {
        $lt: args.date
      },
      league: {
        $eq: null
      }
    };
    switch(args.type) {
      case "active":
        queryObj.published = true;
        queryObj.isComplete = false;
        break;
      case "completed":
        queryObj.isComplete = true;
        break;
      case "unpublished":
        queryObj.published = false;
        break;
      default:
        break;
    }
    var events = Events.find(queryObj, {
      fields: {
        _id: 1,
        slug: 1,
        "details.name": 1,
        "details.datetime": 1,
        "details.bannerUrl": 1
      },
      sort: {
        "details.datetime": -1
      },
      limit
    }).fetch().map(e => {
      return {
        name: e.details.name,
        date: e.details.datetime,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        type: "event",
        isLeague: false
      }
    }).reverse();
    var leagueQuery = {
      owner: user._id,
      "details.datetime": {
        $lt: args.date
      }
    }
    var leagues = Leagues.find(leagueQuery, {
      fields: {
        _id: 1,
        slug: 1,
        "details.name": 1,
        "details.datetime": 1,
        "details.bannerUrl": 1,
        events: 1
      },
      sort: {
        "details.datetime": -1
      },
      limit
    }).fetch().map(e => {
      return {
        name: e.details.name,
        date: e.details.datetime,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        type: "league",
        id: e._id,
        isLeague: true
      }
    }).reverse();
    leagues = leagues.concat(events).sort((a, b) => {
      if(moment(a.date).isBefore(moment(b.date))) {
        return 1;
      }
      return -1;
    }).slice(0, limit);
    return leagues;
  }
})
