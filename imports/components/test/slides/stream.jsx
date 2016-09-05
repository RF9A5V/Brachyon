import React, { Component } from "react";

export default class StreamPage extends Component {

  backgroundImage(useDarkerOverlay){
    if(useDarkerOverlay){
      return "linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
    }
    return "linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(/images/bg.jpg)";
  }

  render() {
    return (
      <div className="slide-page-container">
        <div className="slide-page row x-center center" style={{background: this.backgroundImage(true)}}>
          <div className="col">
            <iframe src="https://player.twitch.tv/?channel=brachyon" style={{ border: "none" }} scrolling="no" height="378" width="620"></iframe>
            <a style={{marginTop: 20, fontStyle: "italic", padding: 10, backgroundColor: "rgba(0, 0, 0, 0.5)"}} href="https://www.twitch.tv/brachyon?tt_medium=live_embed&tt_content=text_link">Watch live video from brachyon on www.twitch.tv</a>
          </div>
        </div>
      </div>
    )
  }
}
