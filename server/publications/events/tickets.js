Meteor.publish("ticketHolders", (slug) => {
  const event = Events.findOne({slug});
  const instance = Instances.findOne(event.instances[event.instances.length - 1]);
  const tickets = instance.tickets;
  return Meteor.users.find({
    _id: {
      $in: Object.keys(tickets.payables)
    }
  })
})
