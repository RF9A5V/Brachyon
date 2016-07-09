import Games from '/imports/api/games/games.js';
import Sponsorships from '/imports/api/event/sponsorship.js';
import Ticketing from '/imports/api/ticketing/ticketing.js';

Meteor.publish('event', (_id) => {
  event = Events.findOne(_id);
  return [
    Events.find({_id}),
    Images.find({_id: event.banner}),
    Sponsorships.find({_id: event.sponsorship}),
    Ticketing.find({_id: event.ticketing})
  ];
});

Meteor.publish('events', function(){
  return Events.find();
});

Meteor.publish('userEvents', (id) => {
  event_banners = Events.find({owner: id}).fetch().map(function(value){ return value.banner });
  games = Meteor.users.findOne(id).profile.games || [];
  game_banners = Games.find({_id: { $in: games }}).fetch().map((game) => { return game.banner });
  return [
    Events.find({owner: id}),
    Images.find({_id: { $in: event_banners.concat(game_banners) } }),
    Games.find({_id: { $in: games }})
  ];
})

Meteor.publish("discoverEvents", function(){
  var eventOwnerIds = Events.find({published: true}).fetch().map(function(event){
    return event.owner;
  })
  return [
    Events.find({published: true}),
    Meteor.users.find({_id:{$in: eventOwnerIds}}, {fields: {"username":1}})
  ]
})

Meteor.publish('event_search', function(params){
  if(params == null){
    return Events.find();
  }
  query = {}
  if(params.search){
    query['title'] = new RegExp(params.search.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i');
  }
  if(params.location){
    query['location.coords'] = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [ params.location.lng, params.location.lat ]
        }
      }
    }
  }
  return Events.find(query);
})

Meteor.publish('events_to_review', function(){
  return Events.find({ under_review: true });
})

Meteor.publish('unapproved_games', function() {
  return [
    Games.find({ approved: false })
  ];
})

Meteor.publish('games', function(){
  return [
    Games.find({approved: true})
  ]
})

Meteor.publish('game_search', function(query) {
  if(query == ""){
    return [];
  }
  return Games.find({
    name: new RegExp(query.split(' ').map(function(value){ return `(?=.*${value})`; }).join(''), 'i')
  });
})
