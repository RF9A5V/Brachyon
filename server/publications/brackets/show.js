import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.publish('brackets', (_id) => {
  return [
    Brackets.find({_id})
  ];
});

Meteor.publish("bracketContainer", (_id) => {
  var instance = Instances.findOne(_id);
  if(!instance) {
    return [];
  }
  return [
    Instances.find({_id}),
    Brackets.find({ _id: {
      $in: instance.brackets.map(obj => { obj.id })
    }})
  ]
})
