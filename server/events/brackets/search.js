Meteor.methods({
  "events.brackets.findPlayerCandidates"(id, index, request) {
    const instance = Instances.findOne(id);
    const bracketMeta = instance.brackets[index];
    const partIds = (bracketMeta.participants || []).map(p => {
      return p.id
    });
    return Meteor.users.find({
      _id: {
        $nin: partIds
      },
      username: new RegExp("^" + request, "i")
    }, {
      fields: {
        username: 1,
        "profile.imageUrl": 1,
        "profile.alias": 1
      }
    }).fetch();
  }
})
