Meteor.methods({
  "brackets.checkSlug"(slug) {
    const instance = Instances.findOne({slug});
    if(instance) {
      throw new Meteor.Error(400);
    }
  }
})
