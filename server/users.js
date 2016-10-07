var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);
import { ProfileImages } from "/imports/api/users/profile_images.js";

Meteor.methods({
  "users.update_profile_image"(id) {
    if(!Meteor.userId()){
      return false;
    }
    var user = Meteor.users.findOne(Meteor.userId());
    if(user.profile.image){
      ProfileImages.remove(user.profile.image);
    }
    var img = ProfileImages.findOne(id);
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.image": id,
        "profile.imageUrl": img.link()
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
  "users.purchase_currency"(value, toCharge) {
    if(!Meteor.userId()) {
      throw new Meteor.Error(401, "Log in to access currency.");
    }
    Async.runSync((done) => {
      stripe.charges.create({
        amount: toCharge,
        currency: "usd",
        customer: Meteor.user().stripeCustomer
      }, function(err, response) {
        done(err, response)
      })
    });
    Meteor.users.update(Meteor.userId(), {
      $inc: {
        "profile.amount": value
      }
    });
  }
})
