import Discord from "discord.js";

var bot;
var testChannel = "153662469586419712"

var renameBot = function(name) {
  bot.setUsername(name, function(err){
    if(err){
      console.log(err);
      bot.sendMessage(testChannel, "You broke me. Thanks.");
    }
    else {
      bot.sendMessage(testChannel, `I now identify as ${name}.`);
    }
  });
}


Meteor.methods({
  "bot.sayHello"() {
    bot = new Discord.Client();
    bot.loginWithToken("MjA2MTQzMDgwMzg5Mjc5NzQ1.CnQUlg.TV2Cogw8gO__zE32XjmUrupNbHM");
    bot.on("ready", function(){
      bot.sendMessage(testChannel, "What scrubs.");
    });
    bot.on("message", function(obj){
      var content = obj.cleanContent;
      if(content.slice(0, 5) == "!brac"){
        var cmd = content.slice(6);
        if(cmd.length == 0){
          bot.sendMessage(obj.author, "go away");
        }
        else {
          cmd = cmd.split(" ");
          if(cmd[0] == "rename"){
            if(!cmd[1] || cmd[1] == ""){
              bot.sendMessage(testChannel, "No.");
            }
            else {
              renameBot(cmd.slice(1).join(" "));
            }
          }
        }
      }
    });
  },
  "bot.informOnUpdate"(message) {
    if(!bot){
      return;
    }
    console.log(message);
    bot.sendMessage(testChannel, message);
  }
})
