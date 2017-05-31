import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import Organizations from "/imports/api/organizations/organizations.js";
import Leagues from "/imports/api/leagues/league.js";

Meteor.publish("event_participants", (slug, hash) => {
  var query = {
    slug
  }
  if(hash) {
    query.hash = hash;
  }
  var event = Events.findOne(query);
  if(event && event.brackets && event.brackets[0]) {
    var users = Meteor.users.find({
      _id: {
        $in: event.brackets[0].participants || []
      }
    });
    var imgIDs = users.fetch().map((user) => { return user.profile.image });
    return [
      users
    ]
  }
  else {
    return Meteor.users.find({ _id: null })
  }
})

Meteor.publish("bracket", (eventID, bracketIndex) => {
  var event = Events.findOne(eventID);
  if(!event) {
    throw new Meteor.Error(404, "Event not found.");
  }
  if(!event.brackets || !event.brackets[bracketIndex]) {
    throw new Meteor.Error(404, "Bracket not found for event.");
  }
  var game = Games.findOne(event.brackets[bracketIndex].game);
  var participantIDs = (event.brackets[bracketIndex].participants || []).map((participant) => {
    if(participant.isUser){
      return participant.user;
    }
    return "";
  });
  var users = Meteor.users.find({_id: {
    $in: participantIDs
  }});
  var profileImageIDs = users.fetch().map((user) => {
    return user.profile.image
  });

  return [
    Events.find({_id: eventID}),
    Games.find({_id: event.brackets[bracketIndex].game}),
    users
  ]
})

Meteor.publish('events', function(){
  return Events.find();
});

Meteor.publish('userEvents', (id) => {
  var user = Meteor.users.findOne(id);
  var events = Events.find({owner: id});
  var gameSet = new Set();
  var games = Games.find({
    _id: {
      $in: Array.from(gameSet)
    }
  });
  var instances = events.map((event) => {
    return event.instances[event.instances.length - 1];
  })
  return [
    Events.find({owner: id}, { limit: 6 }),
    games,
    Instances.find({ _id: { $in: instances } })
  ];
})

Meteor.smartPublish("discoverEvents", () => {
  var events = Events.find({published: true});
  var userIds = [];
  var orgIds = [];
  events.forEach(e => {
    if(e.orgEvent) {
      orgIds.push(e.owner);
    }
    else {
      userIds.push(e.owner);
    }
  });
  var gameSet = new Set();
  var instances = Instances.find({
    _id: {
      $in: events.map((e) => {
        return e.instances.pop();
      })
    }
  })
  instances.forEach((e) => {
    if(e.brackets != null){
      e.brackets.forEach((bracket) => {
        gameSet.add(bracket.game);
      })
    }
  });
  var games = Games.find({_id: { $in: Array.from(gameSet) }});
  var leagues = Leagues.find();
  var leagueEvents = Events.find({ league: { $in: leagues.map(l => l._id) }});
  return [
    Events.find({published: true}),
    Meteor.users.find({_id:{$in: userIds}}, {fields: {"username":1, "profile.image": 1, "profile.imageUrl": 1}}),
    Organizations.find({ _id: { $in: orgIds } }),
    games,
    instances,
    leagues,
    leagueEvents
  ]
});

Meteor.publish("promotedEvents", function() {
  var events = Events.find({
    "promotion.active": true
  }, {
    sort: {
      "promotion.bid": -1,
      "details.datetime": -1
    },
    limit: 5
  });
  var userSet = new Set();
  events.forEach(event => {
    userSet.add(event.owner);
  })
  var users = Meteor.users.find({ _id: { $in: Array.from(userSet) } });
  var instances = events.map((event) => {
    return event.instances.pop();
  })
  return [
    events,
    users,
    Instances.find({ _id: { $in: instances } })
  ]
})

Meteor.publish("userSearch", function(usernameSubstring) {
  if(usernameSubstring == null || usernameSubstring.length == 0) {
    return Meteor.users.find({ _id: null });
  }
  var users = Meteor.users.find({
    username: new RegExp(usernameSubstring, "i")
  }, {
    username: 1,
    profile: 1
  });
  return [
    users
  ];
})

Meteor.publish('eventsUnderReview', function(){
  var events = Events.find({ underReview: true });
  var owners = Meteor.users.find({
    _id: {
      $in: events.map((e) => {
        return e.owner;
      })
    }
  });
  return [
    Events.find({ underReview: true }),
    owners
  ];
})

Meteor.publish('unapproved_games', function() {
  var games = Games.find({approved: false}).fetch().map(function(game) { return game.banner });
  return [
    Games.find({ approved: false }),
    Banners.find({_id: { $in: games }}).cursor
  ];
})

Meteor.publish("getOrganizationByOwner", function(id) {
  var org = Organizations.find({owner: id});
  return org;
});

Meteor.publish("getOrganizationBySlug", function(slug) {
  var org = Organizations.find({slug: slug});
  var ownerId = org.fetch()[0]._id;
  var events = Events.find({owner: ownerId, orgEvent: true});
  var instances = Instances.find({_id: {$in: events.map( (e) => {
      return e.instances.pop();
      }
    )}
  });
  return [org, events, instances, Leagues.find({ owner: ownerId })];
});
