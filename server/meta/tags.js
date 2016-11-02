import Tags from "/imports/api/meta/tags.js";

Meteor.methods({
  "tags.create"(text) {
    var tag = Tags.findOne({text});
    if(tag) {
      throw new Meteor.Error(403, "Tag with text: " + text + " already exists!");
    }
    Tags.insert({
      text
    })
  },
  "tags.delete"(id) {
    Tags.remove(id);
  }
});
