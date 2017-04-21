import moment from "moment";

Meteor.methods({
  "users.getPlayerEvents"(username, skipIndex, limit, args) {
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
        slug: 1
      },
      sort: {
        "details.datetime": 1
      },
      skip: skipIndex * limit,
      limit
    }).fetch().map(e => {
      return {
        name: e.details.name,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        type: "league",
        id: e._id
      }
    });
    return events;
  },
  "users.getOwnerEvents"(username, skip, limit, args) {
    const user = Meteor.users.findOne({
      username
    });
    var queryObj = {
      owner: user._id
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
      }
    }).fetch().map(e => {
      return {
        name: e.details.name,
        date: e.details.datetime,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        type: "event"
      }
    });
    var leagues = Leagues.find({
      owner: user._id
    }, {
      fields: {
        _id: 1,
        slug: 1,
        "details.name": 1,
        "details.datetime": 1,
        "details.bannerUrl": 1
      },
      sort: {
        "details.datetime": -1
      }
    }).fetch().map(e => {
      return {
        name: e.details.name,
        bannerUrl: e.details.bannerUrl,
        slug: e.slug,
        type: "league",
        id: e._id
      }
    });
    leagues = leagues.concat(events);
    return leagues;
  }
})
