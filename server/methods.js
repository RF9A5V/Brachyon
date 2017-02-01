import { Banners } from "/imports/api/event/banners.js";
import Games from "/imports/api/games/games.js";
import Sponsorships from "/imports/api/event/sponsorship.js";
import Icons from "/imports/api/sponsorship/icon.js";
import Tickets from "/imports/api/ticketing/ticketing.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { Email } from 'meteor/email'

var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({

  "events.save_for_advanced"(attrs) {
    if(!attrs.details){
      throw new Error("Event needs details.");
    }
    if(!Meteor.userId()){
      throw new Error("Needs to be logged in.");
    }
    attrs.published = false;
    attrs.underReview = false;
    attrs.active = false;
    attrs.complete = false;
    attrs.owner = Meteor.userId();
    attrs.sponsors = {};
    attrs.participants = [];
    return Events.insert(attrs);
  },

  "events.update_details"(id, attrs) {
    var obj = {};
    Object.keys(attrs).map(function(key){
      obj[`details.${key}`] = attrs[key];
    });
    var event = Events.findOne(id);
    if(obj["details.banner"] && event.details.banner) {
      Banners.remove(event.details.banner);
    }
    if(Object.keys(obj).length > 0){
      Events.update(id, {
        $set: obj
      });
    }
  },

  "events.update_organize"(id, attrs){
    if(Object.keys(attrs).length == 0) {
      return;
    }
    var obj = {};
    Object.keys(attrs).map(function(key){
      obj[`organize.${key}`] = attrs[key];
    });
    obj["organize.active"] = true;
    Events.update(id, {
      $set: obj
    });
  },

  "events.update_revenue"(id, attrs){
    if(Object.keys(attrs).length == 0) {
      return;
    }
    var event = Events.findOne(id);
    var obj = {};
    var flattener = function(obj) {
      return Object.keys(obj).map(function(key) {
        if(typeof obj[key] == "object") {
          var subItems = flattener(obj[key]);
          var ensureNoSubArray = [];
          subItems.map(function(val){
            ensureNoSubArray = ensureNoSubArray.concat(val);
          });
          var splitOrJoin = [];
          ensureNoSubArray.map(function(val){
            var subKey = Object.keys(val)[0];
            splitOrJoin.push({ [key + "." + subKey]: val[subKey] })
          });
          return splitOrJoin;
        }
        else {
          return { [key]: obj[key] };
        }
      })
    }
    var items = {};
    flattener(attrs)[0].map(function(item) {
      var subKey = Object.keys(item)[0]
      items["revenue." + subKey] = item[subKey];
    });
    items["revenue.active"] = true;
    Events.update(id, {
      $set: items
    });
  },

  "events.update_promotion"(id, attrs){
    if(Object.keys(attrs).length == 0) {
      return;
    }
    var obj = {};
    Object.keys(attrs).map(function(key){
      obj[`promotion.${key}`] = attrs[key];
    });
    obj["promotion.active"] = true;
    Events.update(id, {
      $set: obj
    });
  },
  "events.create_tournament"(id, obj) {
    event = Events.findOne(id);
    api_key = "LxUg2LSuH52eHxxtuPuX3nNiEjSDXxKBit3G3376";
    headers = {
      contentType: "json"
    }
    Meteor.http.post("https://api.challonge.com/v1/tournaments.json", {
      data: {
        api_key,
        tournament: Object.assign({
          name: id,
          url: id
        }, obj)
      },
      headers
    }, function(err, result){
      if(!err){
        Events.update(id, {
          $set: {
            tournament_running: true
          }
        })
        Meteor.http.post(`https://api.challonge.com/v1/tournaments/${id}/participants/bulk_add.json`, {
          data: {
            api_key,
            participants: event.participants
          },
          headers
        }, function(err, result) {
          if(!err){
            Meteor.http.post(`https://api.challonge.com/v1/tournaments/${id}/start.json`, {
              data: {
                api_key
              },
              headers
            })
          }
        })
      }
    })
  },
  "events.destroy_tournament"(id) {
    api_key = "LxUg2LSuH52eHxxtuPuX3nNiEjSDXxKBit3G3376";
    headers = {
      contentType: "json"
    }
    Meteor.http.call("DELETE", `https://api.challonge.com/v1/tournaments/${id}.json`, {
      data: {
        api_key
      },
      headers
    }, function(err, result){
      if(err){
      }
      else {
        Events.update(id, {
          $set: {
            tournament_running: false
          }
        })
      }
    })
  },
  "events.send_for_review"(id){
    Events.update(id, {
      $set: {
        under_review: true,
        published: false
      }
    })
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

  "user.getStripeCustomerData": function() {
    if(Meteor.user().stripeCustomer == null) {
      return {};
    }
    var cards = Async.runSync(function(done) {
      stripe.customers.listCards(Meteor.user().stripeCustomer, function(err, response) {
        done(err, response);
      });
    });
    return cards;
  },
  "addCard": function(cardToken){
    if(Meteor.user().stripeCustomer == null){
      var customerCreate = Async.runSync(function(done){
        stripe.customers.create({
          source: cardToken
        }, function(err, response){
          done(err, response);
        })
      })
      if(customerCreate.error){
        throw new Meteor.Error(500, "stripe-error-create", customerCreate.error.message);
      }
      else{
        Meteor.users.update(Meteor.userId(), {$set: {stripeCustomer: customerCreate.result.id}});
        return
      }
    }
    else{
      var customerUpdate = Async.runSync(function(done){
        stripe.customers.createSource(Meteor.user().stripeCustomer,{
          source: cardToken
        }, function(err, response){
          done(err, response);
        })
      })
      if(customerUpdate.error){
        throw Meteor.Error(500, "stripe-error-update", customerUpdate.error.message);
      }
      else{
        return
      }
    }
  },
  "loadCardInfo": function(){
    return {
      "hasCard": false
    }
  },
  "chargeCard": function(payableTo, chargeAmount, cardID){
    if(Meteor.user().stripeCustomer == Meteor.users.findOne(payableTo).services.stripe.id) {
      throw new Meteor.Error(403, "Can't pay yourself.");
    }
    // Currently only used for tickets
    stripe.charges.create({
      amount: chargeAmount,
      currency: "usd",
      customer: Meteor.user().stripeCustomer,
      card: cardID,
      destination: Meteor.users.findOne(payableTo).services.stripe.id
    }, function(err, response){
      if(err){
        throw new Meteor.Error(500, "stripe-error", err.message);
      }
      else{
        return response;
      }
    })
  },

  "events.saveCFCharge"(eventID, amount, cardID){
    var event = Events.findOne(eventID);
    if(Meteor.user().stripeCustomer == Meteor.users.findOne(event.owner).services.stripe.id) {
      throw new Meteor.Error(403, "Can't pay yourself.");
    }
    var instance = Instances.findOne(event.instances.pop());
    if(!event.crowdfunding || !event.crowdfunding.tiers) {
      throw new Meteor.Error(404, "Can't crowdfund event with no crowdfunding.");
    }
    var tierIndex = -1;
    event.crowdfunding.tiers.forEach((tier, i) => {
      if(tier.price == amount) {
        tierIndex = i;
      }
    });
    if(tierIndex < 0) {
      throw new Meteor.Error(403, "Can't sponsor tier with less than minimum amount.");
    }
    var contribs = new Set((instance.cf || {})[tierIndex]);
    var hasContributed = Array.from(contribs).map((obj) => { return obj.payee; }).indexOf(Meteor.userId()) >= 0;
    if(hasContributed) {
      throw new Meteor.Error(403, "Can't buy already purchased tier.");
    }
    else {
      Instances.update(instance._id, {
        $push: {
          [`cf.${tierIndex}`]: {
            payee: Meteor.userId(),
            amount
          }
        }
      })
    }
  },

  "isStripeConnected": function(connected){
    Meteor.users.update(Meteor.userId(), {$set: {"profile.isStripeConnected": connected}});
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
  },

  "users.update_games"(games){
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.games": games
      }
    })
  },

  "events.create_sponsorship"(id) {
    Sponsorships.insert({
      eventId: id,
      start: { amount: 0 },
      branches: [null, null, null, null, null],
      tiers: []
    }, function(err, obj){
      Events.update(id, {
        $set: {
          sponsorship: obj
        }
      })
    })
  },

  "sponsorships.add_node"(id, branch) {
    var branches = Sponsorships.findOne(id).branches;
    if(branches[branch] == null){
      Sponsorships.update(id, {
        $set: {
          [`branches.${branch}`]: {
            name: "Branch",
            icon: null,
            nodes: []
          }
        }
      })
    }
    else {
      Sponsorships.update(id, {
        $push: {
          [`branches.${branch}.nodes`]: {
            amount: 10,
            description: "Description"
          }
        }
      })
    }
  },

  "sponsorships.update_node"(id, branch, index, attrs){
    if(attrs.icon){
      file = new FS.File();
      file.attachData(attrs.icon);
      Icons.insert(file, function(err, obj){
        if(obj){
          Sponsorships.update(id, {
            $set: {
              [`branches.${branch}.name`]: attrs.name,
              [`branches.${branch}.icon`]: obj.url({brokenIsFine: true}),
              [`branches.${branch}.nodes.${index}.amount`]: attrs.amount,
              [`branches.${branch}.nodes.${index}.description`]: attrs.description
            }
          })
        }
      })
    }
    else {
      Sponsorships.update(id, {
        $set: {
          [`branches.${branch}.name`]: attrs.name,
          [`branches.${branch}.nodes.${index}.amount`]: attrs.amount,
          [`branches.${branch}.nodes.${index}.description`]: attrs.description
        }
      })
    }
  },

  "sponsorships.delete_node"(id, pos, index) {
    spons = Sponsorships.findOne(id);
    if(spons){
      Sponsorships.update(id, {
        $unset: {
          [`branches.${pos}.nodes.${index}`]: 1
        }
      });
      Sponsorships.update(id, {
        $pull: {
          [`branches.${pos}.nodes`]: null
        }
      })
    }
  },

  "events.create_ticketing"(id) {
    Tickets.insert({
      tickets: [
        {
          name: "Ticket",
          description: "This is your ticket description.",
          limit: 100,
          amount: 100,
          payableTo: Meteor.userId()
        }
      ]
    }, function(err, obj){
      if(err){
        throw new Error(err.reason)
      }
      else {
        Events.update(id, {
          $set: {
            ticketing: obj
          }
        })
      }
    })
  },

  "ticketing.create_ticket"(id) {
    Tickets.update(id, {
      $push: {
        tickets: {
          name: "Ticket",
          description: "This is your ticket description.",
          limit: 100,
          amount: 100,
          payableTo: Meteor.userId()
        }
      }
    })
  },

  "ticketing.update_ticket"(id, tickets, index) {
    Tickets.update(id, {
      $set: {
        tickets
      }
    })
  },

  "ticketing.delete_ticket"(id, index) {
    tickets = Tickets.findOne(id).tickets;
    tickets.splice(index - 1, 1);
    Tickets.update(id, {
      $set: {
        tickets
      }
    })
  },

  "sponsorships.create_tier"(id) {
    Sponsorships.update(id, {
      $push: {
        tiers: {
          name: "Tier",
          description: "Tier description.",
          amount: 100,
          limit: 100,
          payableTo: Meteor.userId()
        }
      }
    })
  },

  "sponsorships.update_tier"(id, tiers){
    Sponsorships.update(id, {
      $set: {
        tiers
      }
    })
  }
})
