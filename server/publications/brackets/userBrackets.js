import Brackets from "/imports/api/brackets/brackets.js";
import Instances from "/imports/api/event/instance.js";

Meteor.publish("userBrackets", (id) => {
  return Instances.find({ owner: id });
})
