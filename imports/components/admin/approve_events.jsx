import React, { Component } from "react";

import LoadingScreen from "/imports/components/public/loading.jsx";

export default class ApproveEventAction extends Component {

  events() {
    console.log(Events.find().fetch());
    return Events.find();
  }

  render() {
    return (
      <div>
        {
          this.events().map((event, i) => {
            console.log(event._id);
            return (
              <div className="event-block col" onClick={this.selectEvent(event).bind(self)} key={i}>
                <h2 className="event-block-title">{ event.details.name }</h2>
                <img src={this.imgOrDefault(event)} />
                <div className="event-block-content">
                  <div className="col">
                    <div className="row flex-pad x-center" style={{marginBottom: 10}}>
                      <div className="row x-center" style={{fontSize: 12}}>
                        <img src={this.profileImageOrDefault(Meteor.users.findOne(event.owner).profile.image)} style={{width: 12.5, height: "auto", marginRight: 5}} />{ Meteor.users.findOne(event.owner).username }
                      </div>
                    </div>
                    <div className="row flex-pad">
                      {
                        event.details.location.online ? (
                          <div style={{fontSize: 12}}><FontAwesome name="signal" /> Online Event</div>
                        ) : (
                          <div style={{fontSize: 12}}>
                            <FontAwesome name="map-marker" /> {event.details.location.city}, {event.details.location.state}
                          </div>
                        )
                      }
                      <span style={{fontSize: 12}}>
                        {moment(event.details.datetime).format("MMM Do, YYYY")}
                        <FontAwesome name="calendar" style={{marginLeft: 5}} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
      </div>
    )
  }
}
