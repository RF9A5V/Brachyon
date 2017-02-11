import React, { Component } from "react";

import BlockContainer from "/imports/components/events/discover/block_container.jsx";

export default class EventSlide extends Component {

  render() {
    var events = Events.find({});

    return (
      <div className="col-1">
        <BlockContainer events={Events.find({})} />
      </div>
    )
  }
}
