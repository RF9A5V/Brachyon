import Games from '/imports/api/games/games.js';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Images } from "/imports/api/event/images.js";

Meteor.publish("event_participants", (id) => {
  var event = Events.findOne(id);
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
      })
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
  })
  return [
    Events.find({_id: eventID}),
    Games.find({_id: event.brackets[bracketIndex].game}),
    Images.find({_id: game.banner}),
    users,
    ProfileImages.find({
      _id: {
        $in: profileImageIDs
      }
    })
  ]
})

Meteor.publish("user", (_id) => {
  var user = Meteor.users.findOne({_id});
  if(!user){
    return Meteor.users.find({_id});
  }
  var games = Games.find({_id: {$in: user.profile.games}});
  var imgs = ProfileImages.find({_id: user.profile.image});
  return [
    Meteor.users.find({_id}),
    ProfileBanners.find({_id: user.profile.banner}),
    imgs.cursor,
    games
  ];
})

Meteor.publish('events', function(){
  return Events.find();
});

Meteor.publish('userEvents', (id) => {
  var user = Meteor.users.findOne(id);
  var events = Events.find({owner: id});
  var gameSet = new Set();
  var imgIds = [];
  events.forEach((e) => {
    if(e.details.banner != null){
      imgIds.push(e.details.banner);
    }
  });
  var games = Games.find({
    _id: {
      $in: Array.from(gameSet)
    }
  });
  games.forEach((game) => {
    imgIds.push(game.banner);
  })
  var images = Images.find({
    _id: {
      $in: imgIds
    }
  })
  return [
    Events.find({owner: id}),
    games,
    ProfileImages.find({_id: user.profile.image}).cursor,
    images.cursor
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
  var imageIDs = events.map((e)=>{return e.details.banner});
  var gameSet = new Set();
  events.forEach((e) => {
    if(e.brackets != null){
      e.brackets.forEach((bracket) => {
        gameSet.add(bracket.game);
      })
    }
  });
  var games = Games.find({_id: { $in: Array.from(gameSet) }});
  imageIDs = imageIDs.concat(games.map((game) => { return game.banner }));
  return [
    Events.find({published: true}),
    Meteor.users.find({_id:{$in: eventOwnerIds}}, {fields: {"username":1}}),
    Images.find({_id: { $in: imageIDs }}),
    games
  ]
})

Meteor.publish("userSearch", function(usernameSubstring) {
  if(usernameSubstring == null || usernameSubstring.length == 0) {
    return Events.find({ _id: null });
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
    profileImages
  ];
})

Meteor.publish('events_to_review', function(){
  return Events.find({ underReview: true });
})

Meteor.publish('unapproved_games', function() {
  var games = Games.find({approved: false}).fetch().map(function(game) { return game.banner });
  return [
    Games.find({ approved: false }),
    Images.find({_id: { $in: games }})
  ];
})

Meteor.publish('games', function(){
  var games = Games.find({approved: true}).fetch().map(function(game) { return game.banner });
  return [
    Games.find({approved: true}),
    Images.find({_id: { $in: games }})
  ]
})

Meteor.publish('game_search', function(query) {
  if(query == ""){
    return [];
  }
  var games = Games.find({
    name: new RegExp(query.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i'),
    approved: true
  });
  var banners = games.fetch().map(function(game) { return game.banner });
  return [
    games,
    Images.find({_id: { $in: banners }})
  ]
})
