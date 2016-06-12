
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
  console.log(id);
  event_banners = Events.find({owner: id}).fetch().map(function(value){ return value.banner });
  return [
    Events.find({owner: id}),
    Images.find({_id: { $in: event_banners } })
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
    console.log(params.location);
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
