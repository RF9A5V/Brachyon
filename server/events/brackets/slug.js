import { bracketHashGenerator } from "/imports/decorators/gen_bracket_hash.js";

Meteor.methods({
  "brackets.checkSlug"(slug) {
    const instance = Instances.findOne({slug});
    if(instance) {
      throw new Meteor.Error(400);
    }
  },
  "brackets.generateHash"(slug) {
    const instances = Instances.find({
      "brackets.slug": slug
    });
    const tok = bracketHashGenerator(parseInt(Math.random() * 100));
    const conflict = Instances.findOne({
      "brackets.slug": slug + "-" + tok
    });
    if(conflict) {
      return Meteor.call("brackets.generateHash", slug);
    }
  	return slug + "-" + tok;
  }
})
