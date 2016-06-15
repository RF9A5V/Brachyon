import Games from '/imports/api/games/games.js';

Meteor.publish('event', (_id) => {
  event = Events.findOne(_id);
  return [
    Events.find({_id}),
    Images.find({_id: event.banner})
  ];
});

Meteor.publish('events', function(){
  return Events.find();
});

Meteor.publish('userEvents', (id) => {
  event_banners = Events.find({owner: id}).fetch().map(function(value){ return value.banner });
  games = Meteor.users.findOne(id).profile.games;
  game_banners = Games.find({_id: { $in: games }}).fetch().map((game) => { return game.banner });
  return [
    Events.find({owner: id}),
    Images.find({_id: { $in: event_banners.concat(game_banners) } }),
    Games.find({_id: { $in: games }})
  ];
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
  games = Games.find({ approved: false }).fetch().map(function(val) { return val.banner });
  console.log(games);
  return [
    Games.find({ approved: false }),
    Images.find({_id: { $in: games } })
  ];
})

Meteor.publish('games', function(){
  games = Games.find({ approved: true }).fetch().map(function(val) { return val.banner });
  return [
    Games.find({approved: true}),
    Images.find({_id: { $in: games } })
  ]
})
