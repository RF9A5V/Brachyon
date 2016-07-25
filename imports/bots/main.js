import Discord from "discord.js";

export default class MainBot extends Discord.Client {
  constructor() {
    super();
    this.testServer = "153662469586419712";
    this.testChannel = "153662469586419712";
    this.loginWithToken("MjA2MTQzMDgwMzg5Mjc5NzQ1.CnQUlg.TV2Cogw8gO__zE32XjmUrupNbHM");
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
        self.updateUser(channel.id, "This is a channel for a brachyon event. Hooray!");
        callback(channel);
      }
    })
  }

}
