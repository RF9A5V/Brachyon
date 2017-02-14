import React, { Component } from "react";

import BlockContainer from "/imports/components/events/discover/block_container.jsx";
import Bar from "/imports/components/events/bar.jsx";

export default class EventSlide extends Component {

  render() {
    var events = Events.find({});

    return (
      <div className="row" style={{flexWrap: "wrap", padding: 20, alignItems: "flex-start", alignContent: "flex-start"}}>
        {
          events.map(e => {
            return (
              <Bar event={e} />
            )
          })
        }
      </div>
    )

    // return (
    //   <div className="col-1">
    //     <BlockContainer events={Events.find({})} />
    //   </div>
    // )
  }
}
