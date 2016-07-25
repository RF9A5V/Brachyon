import React, { Component } from "react";

export default class DiscordConnect extends Component {

  onClick(e) {
    Meteor.linkWithDiscord({}, function(err, obj) {
      if(err){
        toastr.error("Couldn't link with Discord", "Error!");
      }
      else {
        toastr.success("Successfully linked with Discord.", "Success!");
        var discordID = Meteor.user().services.discord.id;
        Meteor.call("bot.notifyUser", discordID, "Linked your account with Brachyon. GL;HF.");
      }
    });
  }

  render() {
    if(Meteor.user().services.discord == null) {
      return (
        <button onClick={this.onClick.bind(this)}>
          Connect to Discord
        </button>
      );
    }
    else {
      return (
        <div className="col">
          <span>Already connected to Discord!</span>
          <span>Brachybot will now send you personal messages based on what notifications you want to receive!</span>
        </div>
      )
    }
  }
}
