import Images from '/imports/api/event/images.js';
import Games from '/imports/api/games/games.js';
import Sponsorships from '/imports/api/event/sponsorship.js';
import Icons from '/imports/api/sponsorship/icon.js';
import Tickets from '/imports/api/ticketing/ticketing.js';

var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  'events.create'(id, attrs) {
    if(!attrs){
      throw new Error("Need args.");
    }
    if(!Meteor.userId()){
      throw new Error("You need to be logged in.");
    }
    if(!attrs.eventName){
      throw new Error("Event needs a name.")
    }
    if(!attrs.location){
      throw new Error("Event needs to specify a location.")
    }
    else {
      if(!attrs.location.online && !attrs.location.coords){
        throw new Error("Non online event must have a location specified.")
      }
    }

    f = function(b) {
      banner = b || "";
      Events.insert({
        owner: Meteor.userId(),
        location: attrs.location,
        title: attrs.eventName,
        published: false,
        under_review: false,
        banner
      })
    }

    if(attrs.file){
      file = new FS.File();
      file.attachData(attrs.file.content, { type: attrs.file.type });
      Images.insert(file, function(err, obj){
        if(err){
          Logger.info(err);
        }
        else {
          f(obj._id);
        }
      });
    }
    else {
      f();
    }
  },
  'events.update_title'(id, title){
    Events.update(id, {
      $set: {
        title
      }
    })
  },
  'events.update_description'(id, description){
    Events.update(id, {
      $set: {
        description: description
      }
    })
  },
  'events.update_banner'(id, fileData, type){
    file = new FS.File();
    file.attachData(fileData, { type });
    Images.insert(file, function(err, obj){
      if(err){
        Logger.info(err);
      }
      else {
        Events.update(id, {
          $set: {
            banner: obj._id
          }
        })
      }
    });

  },
  'events.update_time'(id, times){
    Events.update(id, {
      $set: {
        time: times
      }
    })
  },
  'events.update_location'(id, location) {
    Events.update(id, {
      $set: {
        location: {
          type: 'Point',
          coords: location.coords,
          locationName: location.locationName,
          streetAddress: location.streetAddress,
          city: location.city,
          state: location.state,
          zip: location.zip
        }

      }
    });
  },
  'events.add_participant'(id) {
    event = Events.findOne(id);
    if(!event.participants) {
      Events.update(id, {
        $set: {
          participants: [{name: 'Player 1'}]
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
  'events.create_tournament'(id, obj) {
    event = Events.findOne(id);
    api_key = 'LxUg2LSuH52eHxxtuPuX3nNiEjSDXxKBit3G3376';
    headers = {
      contentType: 'json'
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
  'events.destroy_tournament'(id) {
    api_key = 'LxUg2LSuH52eHxxtuPuX3nNiEjSDXxKBit3G3376';
    headers = {
      contentType: 'json'
    }
    Meteor.http.call('DELETE', `https://api.challonge.com/v1/tournaments/${id}.json`, {
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
  'events.send_for_review'(id){
    Events.update(id, {
      $set: {
        under_review: true,
        published: false
      }
    })
  },

  'events.approve'(id){
    Events.update(id, {
      $set: {
        under_review: false,
        published: true
      }
    })
  },

  'events.reject'(id) {
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
  "chargeCard": function(cardToken){
    /*stripe.charges.create({
      amount: 500,
      currency: "usd",
      source: cardToken
    }, function(err, response){
      if(err){
        //throw new Meteor.error(500, "stripe-error", err.message);
        console.log("wow");
      }
      else{
        return response;
      }
    })*/
  },
  "isStripeConnected": function(connected){
    Meteor.users.update(Meteor.userId(), {$set: {isStripeConnected: connected}});
  },
  'games.create'(attrs) {
    if(!attrs){
      throw new Error('Attributes need to be defined.');
    }
    if(!attrs.name){
      throw new Error('Game needs a name.');
    }
    if(!attrs.file){
      throw new Error('Game needs a banner.');
    }

    file = new FS.File();
    file.attachData(attrs.file.content, { type: attrs.file.type });
    Images.insert(file, function(err, obj){
      if(err){
        Logger.info(err);
      }
      else {
        Games.insert({
          name: attrs.name,
          banner: obj._id,
          approved: false
        })
      }
    });
  },

  'games.approve'(id) {
    Games.update(id, {
      $set: {
        approved: true
      }
    })
  },

  'games.reject'(id) {
    Games.remove(id);
  },

  'users.update_games'(games){
    Meteor.users.update(Meteor.userId(), {
      $set: {
        'profile.games': games
      }
    })
  },

  'users.update_profile_image'(id, file){
    f = new FS.File();
    f.attachData(file.content, { type: file.type });
    Images.insert(f, function(err, obj){
      if(err){

      }
      else {
        user = Meteor.users.findOne(id);
        if(user.profile.image_ref){
          Images.remove(user.profile.image_ref)
        }
        Meteor.users.update(id, {
          $set: {
            'profile.image': obj.url({brokenIsFine: true}),
            'profile.image_ref': obj._id
          }
        })
      }
    })
  },
  'events.create_sponsorship'(id) {
    Sponsorships.insert({
      eventId: id,
      start: { amount: 0 },
      branches: [null, null, null, null, null]
    }, function(err, obj){
      Events.update(id, {
        $set: {
          sponsorship: obj
        }
      })
    })
  },

  'sponsorships.update_nodes'(id, branches){
    branches = branches.map(function(val){
      if(val != null){
        if(val.file != null){
          file = new FS.File();
          file.attachData(val.file);
          Icons.insert(file, function(err, obj){
            if(err){
              console.log(err);
              throw new Error('Shit');
            }
            else {
              delete val.file;
              val.icon = obj.url({brokenIsFine: true});
              return val;
            }
          })
        }
      }
      return val;
    })

    Sponsorships.update(id, {
      $set: {
        branches
      }
    })
  },

  'sponsorships.delete_node'(id, pos, index) {
    spons = Sponsorships.findOne(id);
    if(spons){
      branches = spons.branches;
      branches[pos].nodes.splice(index, 1);
      Sponsorships.update(id, {
        $set: {
          branches
        }
      });
    }
  },

  'events.create_ticketing'(id) {
    Tickets.insert({
      tickets: []
    }, function(err, obj){
      console.log(obj)
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

  'ticketing.create_ticket'(id) {
    Tickets.update(id, {
      $push: {
        tickets: {
          name: 'Ticket',
          description: 'This is your ticket description.',
          limit: 100,
          amount: 100
        }
      }
    })
  },

  'ticketing.update_ticket'(id, tickets, index) {
    Tickets.update(id, {
      $set: {
        tickets
      }
    })
  },

  'ticketing.delete_ticket'(id, index) {
    tickets = Tickets.findOne(id).tickets;
    tickets.splice(index - 1, 1);
    Tickets.update(id, {
      $set: {
        tickets
      }
    })
  },

  'sponsorships.create_tier'(id) {
    Sponsorships.update(id, {
      $push: {
        tiers: {
          name: 'Tier',
          description: 'Tier description.',
          amount: 100,
          limit: 100
        }
      }
    })
  },

  'sponsorships.update_tier'(id, tiers){
    Sponsorships.update(id, {
      $set: {
        tiers
      }
    })
  }

})
