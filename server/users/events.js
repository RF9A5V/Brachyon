import moment from "moment";

Meteor.methods({
  "users.getPlayerEvents"(username, skipIndex, limit) {
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
    const events = Events.find({
      instances: {
        $in: instances.map(i => { return i._id })
      }
    }, {
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
  "users.getOwnerEvents"(username, skip, limit) {
    const user = Meteor.users.findOne({
      username
    });
    var events = Events.find({
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
