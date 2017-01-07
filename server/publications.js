import Games from '/imports/api/games/games.js';
import Instances from "/imports/api/event/instance.js";
import Organizations from "/imports/api/organizations/organizations.js";

Meteor.publish("event_participants", (slug) => {
  var event = Events.findOne({slug: slug});
  if(event.brackets && event.brackets[0]) {
    var users = Meteor.users.find({
      _id: {
        $in: event.brackets[0].participants || []
      }
    });
    var imgIDs = users.fetch().map((user) => { return user.profile.image });
    return [
      users,
      ProfileImages.find({
        _id: {
          $in: imgIDs
        }
      }).cursor
    ]
  }
  else {
    return Meteor.users.find({ _id: null })
  }
})

Meteor.publish("event_sponsors", (slug) => {
  var event = Events.findOne({slug: slug});
  if(event.crowdfunding && event.crowdfunding.sponsors) {
    var userIds = event.crowdfunding.sponsors.map(obj => {
      return obj.id;
    });
    return Meteor.users.find({
      _id: {
        $in: userIds
      }
    });
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
  })
  return [
    Events.find({_id: eventID}),
    Games.find({_id: event.brackets[bracketIndex].game}),
    Banners.find({_id: game.banner}).cursor,
    users,
    ProfileImages.find({
      _id: {
        $in: profileImageIDs
      }
    }).cursor
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

Meteor.publish("profileImage", (id) => {
  return ProfileImages.find({_id: id});
});

Meteor.publish("discoverEvents", function(){
  var events = Events.find({published: true});
  var eventOwnerIds = events.map(function(event){
    return event.owner;
  });
  var gameSet = new Set();
  var instances = Instances.find({_id: { $in: events.map((e) => {
    return e.instances.pop();
  })}})
  instances.forEach((e) => {
    if(e.brackets != null){
      e.brackets.forEach((bracket) => {
        gameSet.add(bracket.game);
      })
    }
  });
  var games = Games.find({_id: { $in: Array.from(gameSet) }});
  return [
    Events.find({published: true}),
    Meteor.users.find({_id:{$in: eventOwnerIds}}, {fields: {"username":1, "profile.image": 1}}),
    games,
    instances
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
  var profileImages = ProfileImages.find({
    _id: {
      $in: users.fetch().map((user) => { return user.profile.image })
    }
  });
  return [
    users,
    profileImages.cursor
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

Meteor.publish("getUserByUsername", function(query) {
  var user = Meteor.users.find({username: query});
  return user;
});

Meteor.publish("getOrganizationByOwner", function(id) {
  var org = Organizations.find({owner: id});
  return org;
});

Meteor.publish("getOrganizationBySlug", function(slug) {
  var org = Organizations.find({slug: slug});
  return [org, Events.find({owner: org._id, orgEvent: true})];
});
