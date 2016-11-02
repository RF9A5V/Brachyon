import Tags from "/imports/api/meta/tags.js";

Meteor.publish("tags", () => {
  return Tags.find({}, { text: 1 });
})

Meteor.publish("tagSearch", (text) => {
  if(text == "") {
    return [];
  }
  return Tags.find({ text: new RegExp(`${text}.*`) });
})

Meteor.publish("tagsByList", (list) => {
  return Tags.find({ _id: { $in: list } }, { text: 1 });
})
