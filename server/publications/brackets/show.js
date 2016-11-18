import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js"

Meteor.publish('brackets', (_id) => {
  return [
    Brackets.find({_id})
  ];
});
