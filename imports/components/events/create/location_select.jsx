import React, { Component } from "react";
import GoogleMapsLoader from "google-maps";

export default class LocationSelect extends Component {

  componentWillMount() {

    this.setState({
      online: true,
      location: {}
    })

    self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ["geometry", "places"];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById("test")),
      {types: ["geocode"]});
      autocomplete.addListener("place_changed", function(){
        lat = autocomplete.getPlace().geometry.location.lat();
        lng = autocomplete.getPlace().geometry.location.lng();

        // Longitude and Latitude are intentionally set backwards because MongoDB is dumb. DO NOT SWITCH
        self.state.location = {
          type: "Point",
          coords: [ lng, lat ]
        }
        self.props.onChange();
        self.forceUpdate();
      })
    });
  }

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  updateValue(e){
    this.state.online = (e.target.value == 0);
    this.props.onChange(e);
    this.forceUpdate();
  }

  value() {
    return this.state;
  }

  render() {
    return (
      <div>
        <label>
          Is this event online?
          <div>
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={0} checked={this.state.online} />
            <label>Yes</label>
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={1} checked={!this.state.online} />
            <label>No</label>
          </div>
          <div style={this.state.online ? { display: "none" } : {}}>
            <input type="text" id="test" ref="location" placeholder="Enter your location"  style={{marginLeft: 0}} />
          </div>
        </label>
      </div>
    )
  }
}
