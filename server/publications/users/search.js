Meteor.publish("searchAndFilterUserByParticipation", (query, instanceId, index) => {
  const participants = (Instances.findOne(instanceId).brackets[index].participants || []).map(p => {
    return p.id;
  });
  var users = Meteor.users.find({
    username: new RegExp(query, "i"),
    _id: {
      $nin: participants
    }
  }, {
    username: 1,
    profile: 1,
    limit: 20
  });
  return users;
})
