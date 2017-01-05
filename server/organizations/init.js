import Organizations from "/imports/api/organizations/organizations.js";
import { OrgImages } from "/imports/api/organizations/org_profile_images.js";
import { OrgBanners } from "/imports/api/organizations/org_banners.js";

Meteor.methods({
  "organizations.create"(name, description){

    var owner = Meteor.userId();

    var org = Organizations.insert({
      name,
      owner: owner,
      details: {
        description
      },
      roles: {
        "Owner": [],
        "Admin": [],
        "Member": []
      }
    });

    return Organizations.findOne(org)._id;
  }
});
