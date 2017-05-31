import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";
import Matches from "/imports/api/event/matches.js";
import Games from "/imports/api/games/games.js";

Meteor.publish('brackets', (_id) => {
  var bracket = Brackets.findOne(_id);
  var matches = [];
  if(!bracket) {
    return Brackets.find({_id});
  }
  if(!(bracket.pdic)) {
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
  }
  else
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
    Brackets.find({_id}),
    Matches.find({ _id: { $in: matches } })
  ];
});

Meteor.publish("bracketContainer", (slug) => {
  var instance = Instances.findOne({
    "brackets.slug": slug
  });
  if(!instance) {
    return [];
  }
  const index = instance.brackets.findIndex(o => {
    return o.slug == slug;
  })
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
    Instances.find({_id: instance._id}),
    Brackets.find({ _id: instance.brackets[index].id }),
    Meteor.users.find({ _id: { $in: partIds } }),
    Matches.find({ _id: {
      $in: matches
    } }),
    Events.find({_id: instance.event}),
    Leagues.find({ _id: instance.league }),
    Games.find({
      _id: instance.brackets[index].game
    })
  ]
});

Meteor.publish("Matches", (ids) => {
  var matches = [];
  ids.forEach(b => {
    b.forEach(m => {
      if(m) {
        matches.push(m.id);
      }
    })
  })
  return [
    Matches.find({ _id: {
      $in: matches
    } })
  ]
});
