import Brackets from "/imports/api/brackets/brackets.js";

Meteor.publish('brackets', (slug, bracketIndex) => {
  var id = Events.findOne({slug: slug}).brackets[bracketIndex].id;
  var test = Brackets.findOne(id);
  return [
    Brackets.find({_id: id})
  ];
});
