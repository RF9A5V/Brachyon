import React, { Component } from "react";
import GoogleMapsLoader from "google-maps";

export default class LocationSelect extends Component {

  constructor(props) {
    super(props);
    this.state = {
      locationName: props.locationName || "",
      streetAddress: props.streetAddress || "",
      city: props.city || "",
      state: props.state || "",
      zip: props.zip || "",
      coords: props.coords || [],
      online: props.online || true
    }
  }

  componentWillMount() {

    var self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ["geometry", "places"];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (self.refs.streetAddress),
      {types: ["address"]});

      autocomplete.addListener("place_changed", function() {

        var rez = autocomplete.getPlace();

        var [geo, comps] = [
          rez.geometry.location,
          rez.address_components
        ];

        var lat = geo.lat();
        var lng = geo.lng();

        var streetAddress, city, state, zip;
        streetAddress = "";

        for(var i in comps) {
          if(comps[i].types.indexOf("street_number") >= 0) {
            streetAddress += comps[i].short_name;
          }
          else if(comps[i].types.indexOf("route") >= 0) {
            streetAddress += " " + comps[i].long_name
          }
          else if(comps[i].types.indexOf("locality") >= 0) {
            city = comps[i].long_name;
          }
          else if(comps[i].types.indexOf("administrative_area_level_1") >= 0) {
            state = comps[i].short_name;
          }
          else if(comps[i].types.indexOf("postal_code") >= 0){
            zip = comps[i].short_name;
          }
        }

        // Longitude and Latitude are intentionally set backwards because MongoDB is dumb. DO NOT SWITCH
        var coords = [lng, lat]

        self.setState({
          streetAddress,
          city,
          state,
          zip,
          coords
        }, () => {
          if(self.props.onChange) {
            self.props.onChange(self.state);
          }
        });

        self.forceUpdate();
      })
    });
  }

  componentDidUpdate(){
    Object.keys(this.refs).map((function(key){
      this.refs[key].value = this.state[key];
    }).bind(this))
  }

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  updateValue(e){
    this.state.online = e.target.checked;
    if(this.state.online == true) {
      this.setState({
        streetAddress: "",
        city: "",
        state: "",
        zip: "",
        locationName: "",
        coords: []
      })
    }
    this.forceUpdate();
  }

  value() {
    if(!this.state.online) {
      if(this.state.coords.length != 2) {
        toastr.error("You need to set your location on this form!");
        throw new Error("Location not set.");
      }
      return this.state;
    }
    return {
      online: true
    };
  }

  onChange(e) {
    this.setState({
      streetAddress: this.refs.streetAddress,
      city: this.refs.city,
      state: this.refs.state,
      zip: this.refs.zip
    });
  }

  onLocChange(e) {
    this.setState({
      locationName: e.target.value
    });
  }

  render() {
    return (
      <div>
        <div>
          <div className="row x-center" style={{margin: "10px 0"}}>
            <h5>
              Is this event online?
            </h5>
            <input type="checkbox" onChange={this.updateValue.bind(this)} defaultChecked={this.state.online} />
          </div>
        </div>
        <div className="col" style={{display: this.state.online ? "none" : ""}}>
          <label className="input-label">Location Name</label>
          <input onChange={this.onLocChange.bind(this)} ref="locationName" type="text" placeholder="(Optional) Building your event is held in." defaultValue={this.state.locationName} style={{marginTop: 0}}/>
          <label className="input-label">Street Address</label>
          <input type="text" id="streetAddress" ref="streetAddress" placeholder="Enter your location" defaultValue={this.state.streetAddress} style={{marginTop: 0}} />
          <div className="row">
            <div className="col" style={{width: "50%", marginRight: 10}}>
              <label className="input-label">City</label>
              <input type="text" ref="city" defaultValue={this.state.city} style={{margin: 0}} />
            </div>
            <div className="col" style={{width: "25%", marginRight: 10}}>
              <label className="input-label">State</label>
              <input type="text" ref="state" defaultValue={this.state.state} style={{margin: 0}} />
            </div>
            <div className="col" style={{width: "25%"}}>
              <label className="input-label">Zip</label>
              <input type="text" ref="zip" defaultValue={this.state.zip} style={{margin: 0}} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
