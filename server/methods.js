import Images from '/imports/api/event/images.js';

var stripe = StripeAPI(Meteor.settings.private.stripe.testSecretKey);

Meteor.methods({
  'events.create'() {
    if(!Meteor.userId()){
      return;
    }
    Events.insert({
      owner: Meteor.userId(),
      location: {},
      published: false,
      under_review: false
    })
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
        console.log(result.data.tournament);
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
        console.log(err)
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
  }
})
