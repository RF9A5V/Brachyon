import React, { Component } from "react";
import LocationSelect from "/imports/components/events/create/location_select.jsx";

export default class LocationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id,
      showLoc: true
    }
  }

  value() {
    return this.refs.location.value();
  }

  render() {
    var event = Events.findOne();
    return (
      <div>
        <h4>Location</h4>
        <div style={{marginBottom: 10}} className="submodule-bg">
          <div className="row">
            <LocationSelect ref="location" online={event.details.location.online} {...(event.details.location.online ? {} : event.details.location)} />
          </div>
        </div>
      </div>
    )
  }
}
