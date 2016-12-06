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

  onLocationSave() {
    Meteor.call("events.details.saveLocation", this.state.id, this.refs.location.value(), (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        return toastr.success("Successfully updated location.", "Success!");
      }
    })
  }

  render() {
    var event = Events.findOne();
    return (
      <div>
        <div className="button-row">
          <button onClick={this.onLocationSave.bind(this)}>Save</button>
        </div>
        <h4>Location</h4>
        <div style={{marginBottom: 10}} className="submodule-bg">
          <div className="row">
            <LocationSelect ref="location" online={event.details.location.online} {...(event.details.location.online ? {} : event.details.location)} />
          </div>
          <div style={{marginTop: 10}} className="row center"><button onClick={this.onLocationSave.bind(this)}>Save</button></div>
        </div>
      </div>
    )
  }
}
