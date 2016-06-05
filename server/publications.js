
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
  return Events.find({owner: id});
})
