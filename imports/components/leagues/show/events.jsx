import React, { Component } from "react";

import BlockContainer from "/imports/components/events/discover/block_container.jsx";

export default class EventSlide extends Component {

  backgroundImage(useDarkerOverlay){
    var imgUrl = this.props.event.details.bannerUrl ? this.props.event.details.bannerUrl : "/images/bg.jpg";
    if(useDarkerOverlay){
      return `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
    }
    return `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.85)), url(${imgUrl})`;
  }

  render() {
    var events = Events.find({});

    return (
      <div className="col-1 slide" style={{backgroundImage: this.backgroundImage(false), padding: 20, marginBottom: 40}}>
        <BlockContainer events={Events.find({})} />
      </div>
    )
  }
}
