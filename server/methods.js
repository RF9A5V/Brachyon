import { Banners } from "/imports/api/event/banners.js";
import Games from "/imports/api/games/games.js";
import Sponsorships from "/imports/api/event/sponsorship.js";
import Icons from "/imports/api/sponsorship/icon.js";
import Tickets from "/imports/api/ticketing/ticketing.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { Email } from 'meteor/email'

var stripe = {};

Meteor.methods({
  "getUsername"(id) {
    const user = Meteor.users.findOne(id);
    return user ? user.username : null;
  },

  "events.approve"(id){
    Events.update(id, {
      $set: {
        under_review: false,
        published: true
      }
    })
  },

  "events.reject"(id) {
    Events.update(id, {
      $set: {
        under_review: false,
        published: false
      }
    })
  },

  "events.delete"(id) {
    Events.remove(id);
  },

  "events.unpublish"(id) {
    Events.update(id, {
      $set: {
        published: false,
        underReview: false
      }
    })
  },

  'games.create'(name, description, imgID) {
    var img = GameBanners.findOne(imgID);
    Games.insert({
      name,
      description,
      banner: imgID,
      bannerUrl: img.link(),
      approved: true
    })
  },

  "games.edit"(id, name, description, imgID) {
    var game = Games.findOne(id);
    var img = Banners.findOne(imgID);
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    Games.update(id, {
      $set: {
        name,
        description,
        banner: imgID,
        bannerUrl: img.link()
      }
    });
  },

  "games.delete"(id) {
    var game = Games.findOne(id);
    if(!game) {
      throw new Meteor.Error(404, "Game not found!");
    }
    Games.remove(id);
  },

  "users.create"(email, username, password) {
    var createUser = () => {
      var user;
      try {
        user = Accounts.createUser({
          email,
          password,
          username,
          profile: {
            games: []
          },
          oauth: {
            isStripeConnected: false
          }
        });
        if(user){
          if(!Meteor.isDevelopment){
            Accounts.sendVerificationEmail(user);
          }
          var token = Accounts._generateStampedLoginToken();
          Accounts._insertLoginToken(user, token);
          return token;
        }
        else {
          return null;
        }
      }
      catch(e) {
        throw e;
      }
    }
    if(!Meteor.isDevelopment) {
      var response = Meteor.http.post(`https://apilayer.net/api/check?access_key=${Meteor.settings.private.mailboxlayer.key}&email=${email}`);
      response = response.data;
      if(response.format_valid && response.mx_found && response.smtp_check && !response.disposable) {
        return createUser();
      }
      else {
        throw new Meteor.Error(403, "Need valid email.");
      }
    }
    else {
      return createUser();
    }
  }
})
