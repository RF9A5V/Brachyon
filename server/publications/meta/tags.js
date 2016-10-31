import Tags from "/imports/api/meta/tags.js";

Meteor.publish("tags", () => {
  return Tags.find({}, { text: 1 });
})
