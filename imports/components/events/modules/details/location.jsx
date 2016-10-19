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
        <div className="submodule-bg">
          <div className="row center">
            <h3>Location</h3>
          </div>
          <div className="row">
            <div className="submodule-section" style={{width: "30%", minWidth: 200, height: 500}}>
              <LocationSelect ref="location" {...(event.details.location.online ? {} : event.details.location)} />
            </div>
            <div className="submodule-section col-1 row center x-center" style={{height: 500}}>
              {
                event.details.location.online ? (
                  <span className="section">
                    Online
                  </span>
                ) : (
                  <div className="col center x-center">
                    <div className="col" style={{textAlign: "left", display: "inline-flex"}}>
                      <span className="section">{ event.details.location.locationName }</span>
                      <span className="section">{ event.details.location.streetAddress }</span>
                      <span className="section">{ event.details.location.city + " " + event.details.location.state + ", " + event.details.location.zip }</span>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
