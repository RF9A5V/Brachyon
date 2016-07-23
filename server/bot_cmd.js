import MainBot from "/imports/bots/main.js";

var bot;

Meteor.methods({
  "bot.sayHello"() {
    bot = new MainBot();
    bot.on("ready", function(){
      bot.yellAtScrubs();
    });
  },
  "bot.informOnUpdate"(message) {
    if(!bot){
      return;
    }
    bot.sendMessage(message);
  }
})
