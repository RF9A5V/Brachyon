import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js"

Meteor.publish('brackets', (_id) => {
  return [
    Brackets.find({_id})
  ];
});

Meteor.publish("bracketByEvent", (slug, index) => {
  var event = Events.findOne({slug});
  var instance = Instances.findOne(event.instances.pop());
  return Brackets.find({_id: instance.brackets[index].id});
})
