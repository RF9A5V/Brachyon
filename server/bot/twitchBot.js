import tmi from "tmi.js";

var options = {
  options: {
    debug: true
  },
  connection: {
    cluster: "aws",
    reconnect: true
  },
  identity: {
    username: "BrachyonBot",
    password: Meteor.settings.private.twitch.bot_pass
  }
};

var client = new tmi.client(options);
client.connect();
client.on('connected', function(address, port) {
});

client.on('chat', function(channel, userstate, message, self){
  if(self){
    return;
  }

  if(message == "!bracket"){
    //link to bracket of tournament
  }
});

Meteor.methods({
  "twitch_bot.join"(channel_name){
    client.join(channel_name).then(function(data){
      client.say(channel_name, "Welcome to BrachyonBot! Anything is possible at Brachyon.");
    }).catch(function(err){
      Meteor.Error('404', "Oops failed to connect to Twitch");
    });
  },
  "twitch_bot.say"(channel_name, quote){
    client.say(channel_name, quote);
  },
  "twitch_bot.action"(channel_name, action){
    client.action(channel_name, action);
  }
});
