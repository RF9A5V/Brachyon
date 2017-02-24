import React, { Component } from "react";
import { Banners } from "/imports/api/event/banners.js";

export default class StreamPage extends Component {

  render() {
    var league = Leagues.findOne();
    return (
      <div className="slide-page-container">
        <div className="slide-page row x-center center">
          <div className="col">
            <iframe src={`https://player.twitch.tv/?channel=${league.stream}`} style={{ border: "none" }} scrolling="no" height="378" width="620"></iframe>
            <a style={{marginTop: 20, fontStyle: "italic", padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)"}} href={`https://www.twitch.tv/${league.stream}?tt_medium=live_embed&tt_content=text_link`}>Watch live video from brachyon on www.twitch.tv</a>
          </div>
        </div>
      </div>
    )
  }
}
