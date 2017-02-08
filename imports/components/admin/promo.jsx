import React, { Component } from "react";

export default class Promo extends Component {

  constructor() {
    super();
    this.state = {
      sub: Meteor.subscribe("events.getByPromoted", {
        onReady: () => { this.setState({ ready: true }) }
      })
    }
  }

  render() {
    if(!this.state.ready) {
      return null;
    }
    return (
      <div className="col table">
        <div className="row table-row">
          <div className="col-3">Event Name</div>
          <div className="col-1">Bid Value</div>
          <div className="col-1">Active</div>
        </div>
        {
          Events.find({}, { sort: { "promotion.bid": -1 } }).map(e => {
            return (
              <div className="row table-row">
                <div className="col-3">
                  {e.details.name}
                </div>
                <div className="col-1">
                  <input style={{margin: 0}} type="number" defaultValue={(e.promotion || {}).bid} onBlur={(ev) => {
                    Meteor.call("events.setPromotionValue", e._id, parseInt(ev.target.value))
                  }} />
                </div>
                <div className="col-1">
                  <input type="checkbox" defaultChecked={(e.promotion || {}).active} onClick={(ev) => {
                    Meteor.call("events.setPromotionActive", e._id, !(e.promotion || {}).active);
                  }} />
                </div>
              </div>
            )
          })
        }
      </div>
    )
  }
}
