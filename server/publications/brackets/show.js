import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";

Meteor.publish('brackets', (_id) => {
  var bracket = Brackets.findOne(_id);
  var matches = [];
  bracket.rounds.forEach(b => {
    b.forEach(r => {
      r.forEach(m => {
        if(m) {
          matches.push(m.id);
        }
      })
    })
  })
  return [
    Brackets.find({_id}),
    Matches.find({ _id: { $in: matches } })
  ];
});

Meteor.publish("bracketContainer", (_id) => {
  var instance = Instances.findOne(_id);
  if(!instance) {
    return [];
  }
  var partIds = [];
  instance.brackets.forEach(b => { partIds = partIds.concat((b.participants || []).map(p => { return p.id })) });
  return [
    Instances.find({_id}),
    Brackets.find({ _id: {
      $in: instance.brackets.map(obj => { obj.id })
    }}),
    Meteor.users.find({ _id: { $in: partIds } })
  ]
})
