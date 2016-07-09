import Images from "/imports/api/event/images.js";
import Games from "/imports/api/games/games.js";
import Sponsorships from "/imports/api/event/sponsorship.js";
import Icons from "/imports/api/sponsorship/icon.js";
import Tickets from "/imports/api/ticketing/ticketing.js";
import ProfileImages from "/imports/api/users/profile_images.js";

var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  "events.create"(attrs) {
    if(!attrs.details){
      throw new Error("Event needs details.");
    }
    if(!Meteor.userId()){
      throw new Error("Needs to be logged in.");
    }
    attrs.published = true;
    attrs.underReview = false;
    attrs.owner = Meteor.userId();
    if(attrs.organize){
      if(!attrs.organize.active){
        attrs.organize = {};
      }
      else {
        attrs.banner = Games.findOne(attrs.organize.game).banner;
      }
    }
    if(attrs.revenue){
      if(!attrs.revenue.active){
        attrs.revenue = {};
      }
      else {
        attrs.published = false;
        attrs.underReview = true;
      }
    }
    Events.insert(attrs);
  },

  "events.save_for_advanced"(attrs) {
    if(!attrs.details){
      throw new Error("Event needs details.");
    }
    if(!Meteor.userId()){
      throw new Error("Needs to be logged in.");
    }
    attrs.published = false;
    attrs.underReview = false;
    attrs.owner = Meteor.userId();
    return Events.insert(attrs);
  },

  "events.update_details"(id, attrs) {
    var obj = {};
    Object.keys(attrs).map(function(key){
      if(key == "banner"){
        var file = new FS.File({dimensions: attrs[key].dimensions});
        file.attachData(attrs[key].content, { type: attrs[key].type });
        Images.insert(file, function(err, image){
          if(err){
            console.log(err);
          }
          else {
            Events.update(id, {
              $set: {
                "details.banner": image.url({ brokenIsFine: true })
              }
            })
          }
        })
      }
      else {
        obj[`details.${key}`] = attrs[key];
      }
    });
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

  "events.submit"(id) {
    var event = Events.findOne(id);
    if(event.revenue.active) {
      Events.update(id, {
        $set: {
          underReview: true
        }
      })
    }
    else {
      Events.update(id, {
        $set: {
          published: true
        }
      })
    }
  },

  "events.add_participant"(id) {
    var event = Events.findOne(id);
    if(!event.participants) {
      Events.update(id, {
        $set: {
          participants: [{name: "Player 1"}]
        }
      })
    }
    else {
      Events.update(id, {
        $push: {
          participants: {name: `Player ${event.participants.length + 1}`}
        }
      })
    }
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
        stripe.customers.update(Meteor.user().stripeCustomer,{
          source: cardToken
        }, function(err, response){
          done(err, response);
        })
      })
      if(customerUpdate.error){
        throw Meteor.Error(500, "stripe-error-update", customerUpdate.error.messgae);
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
  "chargeCard": function(payableTo, chargeAmount){
    console.log(Meteor.users.findOne(payableTo));
    stripe.charges.create({
      amount: chargeAmount,
      currency: "usd",
      customer: Meteor.user().stripeCustomer,
      destination: Meteor.users.findOne(payableTo).services.stripe.id
    }, function(err, response){
      if(err){
        //throw new Meteor.error(500, "stripe-error", err.message);
      }
      else{
        return response;
      }
    })
  },
  "isStripeConnected": function(connected){
    Meteor.users.update(Meteor.userId(), {$set: {"profile.isStripeConnected": connected}});
  },
  'games.create'(name, attrs) {
    var file = new FS.File({dimensions: attrs.dimensions});
    file.attachData(attrs.content, { type: attrs.type });
    Images.insert(file, function(err, obj){
      if(err){
        Logger.info(err);
      }
      else {
        Games.insert({
          name: name,
          banner: obj.url({ brokenIsFine: true }),
          approved: false
        })
      }
    });
  },

  "games.approve"(id) {
    Games.update(id, {
      $set: {
        approved: true
      }
    })
  },

  "games.reject"(id) {
    Games.remove(id);
  },

  "users.update_games"(games){
    Meteor.users.update(Meteor.userId(), {
      $set: {
        "profile.games": games
      }
    })
  },

  "users.update_profile_image"(id, file){
    f = new FS.File({dimensions: file.dimensions});
    f.attachData(file.content, { type: file.type });
    ProfileImages.insert(f, function(err, obj){
      user = Meteor.users.findOne(id);
      if(user.profile.image_ref){
        ProfileImages.remove(user.profile.image_ref)
      }
      Meteor.users.update(id, {
        $set: {
          "profile.image": obj.url({brokenIsFine: true}),
          "profile.image_ref": obj._id
        }
      })
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
