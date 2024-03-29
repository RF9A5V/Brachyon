import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";

class Promo extends Component {

  constructor() {
    super();
    this.state = {};
  }

  render() {
    if(!this.props.ready) {
      return null;
    }
    return (
      <div>
        <div className="col table">
          <div className="row table-row">
            <div className="col-3">Event Name</div>
            <div className="col-1">Bid Value</div>
            <div className="col-1">Active</div>
            <div className="col-1">Sponsored</div>
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
                  <div className="col-1">
                    <input type="checkbox" defaultChecked={e.crowdfunding} onClick={() => {
                      Meteor.call("events.setBrachyonPromoted", e._id);
                    }} />
                  </div>
                </div>
              )
            })
          }
        </div>


        <div className="col table">
          <div className="row table-row">
            <div className="col-3">League Name</div>
            <div className="col-1">Bid Value</div>
            <div className="col-1">Active</div>
          </div>
          {
            Leagues.find().map(l=> {
              return(
                <div className="row table-row">
                  <div className="col-3">
                    {l.details.name}
                  </div>
                 <div className="col-1">
                    <input style={{margin: 0}} type="number" defaultValue={(l.promotion || {}).bid} onBlur={(ev) => {
                      Meteor.call("leaguePromotionValue", l._id, parseInt(ev.target.value))
                    }} />
                  </div>
                  <div className="col-1">
                    <input type="checkbox" defaultChecked={(l.promotion || {}).active} onClick={(ev) => {
                      Meteor.call("leaguePromotionActive", l._id, !(l.promotion || {}).active);
                    }} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default createContainer((props) => {
  const eventHandle = Meteor.subscribe('discoverEvents');
  const promotedHandle = Meteor.subscribe("promotedEvents");
  const byPromoted = Meteor.subscribe("events.getByPromoted");
  return {
    ready: eventHandle.ready() && promotedHandle.ready() && byPromoted.ready()
  }
}, Promo)
