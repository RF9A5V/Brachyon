import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class CreateRunnableScreen extends Component {
  render() {
    return (
      <div className="box col center">
        <div className="row-to-col col-1 center x-center">
          <div className="create-sel sel-quick" onClick={ () => { browserHistory.push("/brackets/create") } }>
            <FontAwesome  size="3x" name="sitemap" />
            <h5 style={{margin: 10}}>Quick Bracket</h5>
            <p>
              Instantly generate a bracket that tracks user stats. The bracket will not be displayed in discover.
            </p>
          </div>
          <div className="create-sel sel-event" onClick={() => { browserHistory.push("/events/create") }}>
            <FontAwesome  size="3x" name="square-o" />
            <h5 style={{color: "#00BDFF", margin: 10}}>Event Create</h5>
            <p>
              Create a discoverable event. Add brackets, streaming, crowdfunding, promotion and many other modules to your event. 
            </p>
          </div>
          <div className="create-sel sel-league" onClick={() => { browserHistory.push("/leagues/create") }}>
            <FontAwesome size="3x"  name="clone" />
            <h5 style={{color: "#FF6000", margin: 10}}>League Create</h5>
            <p>
              Create a series of discoverable events, tracking competitor scores from event to event. The competitor with the most points at the end of the league becomes grand champion. 
            </p>
          </div>
        </div>
      </div>
    )
  }
}
