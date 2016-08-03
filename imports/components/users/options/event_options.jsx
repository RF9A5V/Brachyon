import React, { Component } from "react";

export default class EventOptionsPanel extends Component {

  // Does nothing on the backend yet. Really need to figure out what, if any, attributes that users want control over in terms of event views on their page.

  organizerViews() {
    return (
      <div style={{paddingLeft: 20, border: "2px white solid"}}>
        <h4>Select the events you want to display on your page:</h4>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Unpublished*</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Under Review*</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Published</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Running</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Completed</span>
        </div>
        <div style={{fontSize: "8px"}}>* NOT PUBLICLY VIEWABLE</div>
      </div>
    )
  }

  playerViews() {
    return (
      <div style={{paddingLeft: 20, border: "2px white solid"}}>
        <h4>Select the events you want to display on your page:</h4>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Participating</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Sponsored</span>
        </div>
        <div className="row x-center">
          <input type="checkbox" />
          <span>Attending</span>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="side-tab-panel">
          <div className="row x-center">
            <h3 className="col-1">Event Options</h3>
            <button>Save</button>
          </div>
          <div className="col">
            <h4>Are you a tournamanet organizer, player, or both?</h4>
            <div className="row x-center">
              <input type="checkbox" onChange={() => { this.forceUpdate() }} ref="organizer" checked={(Meteor.user().options || {}).organizer} />
              <span>Organizer</span>
            </div>
            { (this.refs.organizer && this.refs.organizer.checked) ? this.organizerViews() : <br /> }
            <div className="row x-center">
              <input type="checkbox" onChange={() => { this.forceUpdate() }} ref="player" checked={(Meteor.user().options || {}).player} />
              <span>Player</span>
            </div>
            { (this.refs.player && this.refs.player.checked) ? this.playerViews() : <br /> }
          </div>
        </div>
      </div>
    )
  }
}
