import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";

Meteor.publish('brackets', (_id) => {
  var bracket = Brackets.findOne(_id);
  var matches = [];
  if(!bracket) {
    return Brackets.find({_id});
  }
  bracket.rounds.forEach(b => {
    if(Array.isArray(b)) {
      b.forEach(r => {
        r.forEach(m => {
          if(m) {
            matches.push(m.id);
          }
        })
      })
    }
    else {
      b.matches.forEach(m => {
        matches.push(m);
      })
    }
  })
  return [
    Brackets.find({_id}),
    Matches.find({ _id: { $in: matches } })
  ];
});

Meteor.publish("bracketContainer", (_id, index) => {
  var instance = Instances.findOne(_id);
  if(!instance) {
    return [];
  }
  var partIds = (instance.brackets[index].participants || []).map(b => { return b.id });
  var matches = [];
  var format = instance.brackets[index].format.baseFormat;
  var bracket = Brackets.findOne(instance.brackets[index].id);
  if(bracket && format != "swiss" && format != "round_robin") {
    bracket.rounds.forEach(b => {
      b.forEach(r => {
        r.forEach(m => {
          if(m) {
            matches.push(m.id);
          }
        })
      })
    })
  }
  else if (bracket)
  {
    bracket.rounds.forEach(r => {
      r.forEach(m => {
        if(m) {
          matches.push(m.id);
        }
      })
    })
  }
  return [
    Instances.find({_id}),
    Brackets.find({ _id: instance.brackets[index].id }),
    Meteor.users.find({ _id: { $in: partIds } }),
    Matches.find({ _id: {
      $in: matches
    } })
  ]
})
