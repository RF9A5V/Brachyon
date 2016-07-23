import Discord from "discord.js";

export default class MainBot extends Discord.Client {
  constructor() {
    super();
    this.testChannel = "153662469586419712";
    this.loginWithToken("MjA2MTQzMDgwMzg5Mjc5NzQ1.CnQUlg.TV2Cogw8gO__zE32XjmUrupNbHM");
  }

  yellAtScrubs() {
    super.sendMessage(this.testChannel, "You scrubs.");
  }

  sendMessage(message) {
    super.sendMessage(this.testChannel, message);
  }  
}
