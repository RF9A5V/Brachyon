import React, { Component } from "react";
import { Banners } from "/imports/api/event/banners.js";

export default class StreamPage extends Component {

  render() {
    var event = Events.findOne();
    return (
      <div className="row x-center center">
        <div className="col center x-center">
          <iframe src={`https://player.twitch.tv/?channel=${event.stream.twitchStream.name}`} style={{ border: "none" }} scrolling="no" height={window.innerWidth * 0.75 * 378 / 620} width={window.innerWidth * 0.75}></iframe>
          <a style={{marginTop: 20, fontStyle: "italic", padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)"}} href={`https://www.twitch.tv/${event.stream.twitchStream.name}?tt_medium=live_embed&tt_content=text_link`}>Watch live video from brachyon on www.twitch.tv</a>
        </div>
      </div>
    )
  }
}
