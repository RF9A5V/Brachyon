import Discord from "discord.js";

export default class MainBot extends Discord.Client {
  constructor() {
    super();
    this.testServer = "153662469586419712";
    this.testChannel = "153662469586419712";
    this.loginWithToken("MjA2MTQzMDgwMzg5Mjc5NzQ1.CnQUlg.TV2Cogw8gO__zE32XjmUrupNbHM");
  }

  startListening() {

    var initAttrsAdmin = {
      color: 0xCC0000,
      hoist: true,
      name: "Admin",
      permissions: [
        "administrator"
      ],
      mentionable: true
    }

    var initAttrsMod = {
      color: 0xCC0000,
      hoist: true,
      name: "Mod",
      permissions: [
        // see the constants documentation for full permissions
        "attachFiles", "sendMessages", "manageChannels"
      ],
      mentionable: true
    }
    var callback = (message) => {
      var messageContent = this.splitMessage(message.content, " ");
      var cmd = messageContent[0];

      if(cmd == "!init" || cmd == "!it") {
        this.createEventChannel("admin");
        this.createEventChannel("mod");
        this.createEventChannel("brachyon_event");
        this.createRole(message.server, initAttrsMod);
        this.createRole(message.server, initAttrsAdmin);
      }
      else if(cmd == "!test") {
        // events = Meteor.subscribe('userEvents', userId);
      }
      else if (cmd == "!link" || cmd == "!zelda" || cmd == "link!navi") {
        Meteor.call("events.link_discord_server", messageContent[1], message.server.id, function(error) {
          if (error) {
            console.log(error);
          }
        });
      }
    };
    var meteorWrappedCallback = Meteor.bindEnvironment(callback);
    super.on("message", meteorWrappedCallback);
  }

  yellAtScrubs() {
    super.sendMessage(this.testChannel, "You scrubs.");
  }

  sendMessage(message) {
    super.sendMessage(this.testChannel, message);
  }

  // Works for any id.
  updateUser(discordUserID, message) {
    super.sendMessage(discordUserID, message);
  }

  createEventChannel(name, callback) {
    var self = this;
    if(name == ""){
      throw new Meteor.Error(500, "Your Discord channel name can't be empty.");
    }
    super.createChannel(this.testServer, name.split(" ").join("_"), function(error, channel){
      if(error){
        console.log(error);
        throw new Meteor.Error(500, "Bot couldn't create a channel for your event.");
      }
      if(callback){
        // self.updateUser(channel.id, "This is a channel for a brachyon event. Hooray!");
        callback(channel);
      }
    })
  }

  //helper methods

  splitMessage(messageContent, separator) {
    return messageContent.split(separator);
  }

}
