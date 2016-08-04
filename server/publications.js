import Games from '/imports/api/games/games.js';
import Sponsorships from '/imports/api/event/sponsorship.js';
import Ticketing from '/imports/api/ticketing/ticketing.js';

Meteor.publish('event', (_id) => {
  var event = Events.findOne(_id);
  var users = Meteor.users.find({_id: { $in: event.participants || [] }});
  var profileImages = ProfileImages.find({_id: { $in: (users.fetch().map( (user) => { return user.profile.image } )) }})
  return [
    Events.find({_id}),
    Images.find({_id: event.details.banner}),
    users,
    profileImages
  ];
});

Meteor.publish("event_participants", (id) => {
  return Meteor.users.find({ _id: { $in: Events.findOne(id).participants || [] } })
})

Meteor.publish("user", (_id) => {
  var user = Meteor.users.findOne({_id});
  if(!user){
    return Meteor.users.find({_id});
  }
  var games = Games.find({_id: {$in: user.profile.games}});
  return [
    Meteor.users.find({_id}),
    ProfileImages.find({_id: user.profile.image}),
    ProfileBanners.find({_id: user.profile.banner}),
    games,
    Images.find({_id: { $in: games.map(function(game){ return game.banner }) }})
  ];
})

Meteor.publish('events', function(){
  return Events.find();
});

Meteor.publish('userEvents', (id) => {
  var user = Meteor.users.findOne(id);
  var event_banners = Events.find({owner: id}).fetch().map(function(value){ return value.details.banner });
  var games = (user.profile || {}).games || [];
  var game_banners = Games.find({_id: { $in: games }}).fetch().map((game) => { return game.banner });
  return [
    Events.find({owner: id}),
    Images.find({_id: { $in: event_banners.concat(game_banners) } }),
    Games.find({_id: { $in: games }}),
    ProfileImages.find({_id: user.profile.image})
  ];
})

Meteor.publish("profileImage", (id) => {
  return ProfileImages.find({_id: id});
});

Meteor.publish("discoverEvents", function(){
  var eventOwnerIds = Events.find({published: true}).fetch().map(function(event){
    return event.owner;
  });
  var imageIDs = Events.find({published: true}).fetch().map((e)=>{return e.details.banner});
  return [
    Events.find({published: true}),
    Meteor.users.find({_id:{$in: eventOwnerIds}}, {fields: {"username":1}}),
    Images.find({_id: { $in: imageIDs }})
  ]
})

Meteor.publish('event_search', function(params){
  if(params == null){
    return Events.find();
  }
  var query = {}
  if(params.search){
    query['details.name'] = new RegExp(params.search.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i');
  }
  if(params.location){
    query['details.location.coords'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [ params.location.lng, params.location.lat ]
        }
      }
    }
  }
  var events = Events.find(query);
  var userIDs = events.fetch().map((e) => { return e.owner });
  var imageIDs = events.fetch().map((e)=>{return e.details.banner});
  return [
    events,
    Meteor.users.find({_id: { $in: userIDs }}, { fields: { username: 1 } }),
    Images.find({_id: { $in: imageIDs }})
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
