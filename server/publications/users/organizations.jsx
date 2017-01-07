import Organizations from "/imports/api/organizations/organizations.js";

Meteor.publish("userOrganizations", (userId) => {
  return Organizations.find({ owner: userId })
})
