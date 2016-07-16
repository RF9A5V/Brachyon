Meteor.methods({
  "users.update_profile_image"(id) {
    if(!Meteor.userId()){
      return false;
    }
    var user = Meteor.users.findOne(Meteor.userId());
    if(user.profile.image){
      ProfileImages.remove(user.profile.image);
    }
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.image": id
      }
    })
  },
  "users.update_profile_banner"(id) {
    if(!Meteor.userId()){
      return false;
    }
    var user = Meteor.users.findOne(Meteor.userId());
    if(user.profile.banner){
      ProfileBanners.remove(user.profile.banner);
    }
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.banner": id
      }
    })
  },
  "users.update_alias"(value) {
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.alias": value
      }
    })
  },
  "users.add_game"(id) {
    Meteor.users.update(Meteor.userId(), {
      $push: {
        "profile.games": id
      }
    })
  },
  "users.purchase_currency"(value) {
    if(!Meteor.userId()) {
      throw new Meteor.Error(401, "Log in to access currency.");
    }
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.amount": value
      }
    })
  }
})
