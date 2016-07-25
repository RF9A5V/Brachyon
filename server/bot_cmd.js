Meteor.methods({
  "bot.notifyUser"(discordUserID, message){
    Meteor.bot.updateUser(discordUserID, message);
  }
})
