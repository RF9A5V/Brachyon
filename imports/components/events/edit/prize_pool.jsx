import React, { Component } from "react";

import SliderBars from "/imports/components/public/sliders.jsx";

export default class PrizePoolBreakdown extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    var event = Events.findOne();
    if(!event.organize || event.organize.length == 0) {
      return (
        <div>
          <h3>To access prize pool functionality, you need to have at least one <b>bracket</b> in the <b>Organize</b> module.</h3>
        </div>
      )
    }
    return (
      <div>
        {
          event.organize.map((bracket, i) => {
            return (
              <div className="col" key={i}>
                <SliderBars />
                <div>
                  <button>Add a Label</button>
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
