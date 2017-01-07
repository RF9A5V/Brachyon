import Organizations from "/imports/api/organizations/organizations.js"

Meteor.methods({
  "organizations.addRole"(orgId, rolename) {
    var org = Organizations.findOne(orgId);
    if(org.roles[rolename] != null) {
      throw new Meteor.Error(403, "Role already exists!");
    }
    Organizations.update(orgId, {
      $set: {
        [`roles.${rolename}`]: []
      }
    })
  },
  "organiztions.removeRole"(orgId, rolename) {
    var org = Organizations.findOne(orgId);
    if(org.roles[rolename] == null) {
      throw new Meteor.Error(403, "Role doesn't exist!");
    }
    var users = org.roles[rolename];
    Organizations.update(orgId, {
      $unset: {
        [`roles.${rolename}`]: ""
      },
      $addToSet: {
        "roles.members": users
      }
    })
  },
  "organizations.assignToRole"(orgId, userId, role) {
    Organizations.update(orgId, {
      $push: {
        [`roles.${role}`]: userId
      }
    })
  },
  "organizations.removeFromRole"(orgId, userId, role) {
    Organzations.update(orgId, {
      $pull: {
        [`roles.${role}`]: userId
      }
    })
  },
  "organizations.transferOwnership"(orgId, userId) {
    var org = Organizations.findOne(orgId);
    var owner = org.owner;
    var next = Meteor.users.findOne(orgId);
    if(!next) {
      throw new Meteor.Error(403, "Can't transfer ownership to user that doesn't exist!");
    }
    Organizations.update(orgId, {
      $set: {
        owner: userId
      },
      $pull: {
        owners: userId
      },
      $push: {
        owners: owner
      }
    })
  }
});
