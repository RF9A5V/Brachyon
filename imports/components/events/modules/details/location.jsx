import React, { Component } from "react";
import LocationSelect from "/imports/components/events/create/location_select.jsx";

export default class LocationPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: Events.findOne()._id
    }
  }

  onLocationSave() {
    Meteor.call("events.details.saveLocation", this.state.id, this.refs.location.value(), (err) => {
      if(err) {
        return toastr.error(err.reason, "Error!");
      }
      else {
        this.props.onItemSelect(this.props.activeItem, 0);
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
          <LocationSelect ref="location" {...(event.details.location || {})} />
        </div>
      </div>
    )
  }
}
