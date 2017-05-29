import React, { Component } from "react";
import GoogleMapsLoader from "google-maps";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class LocationSelect extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      locationName: props.locationName || "",
      streetAddress: props.streetAddress || "",
      city: props.city || "",
      state: props.state || "",
      zip: props.zip || "",
      coords: props.coords || [],
      online: props.online == null ? true : props.online
    }
  }

  componentDidMount() {

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

  renderBase(opts) {
    return (
      <div>
        <div className="row x-center" style={{marginBottom: opts.margin}}>
          <h5 style={{fontSize: opts.fontSize, marginRight: opts.margin}}>
            Is this event online?
          </h5>
          <input type="checkbox" onChange={this.updateValue.bind(this)} defaultChecked={this.state.online} style={{width: opts.checkboxDims, height: opts.checkboxDims, margin: 0}} />
        </div>
        <div className="col" style={{display: this.state.online ? "none" : ""}}>
          <label style={{fontSize: opts.fontSize}} className="input-label">Location Name</label>
          <input className={opts.inputClass} onChange={this.onLocChange.bind(this)} ref="locationName" type="text" placeholder="(Optional) Building your event is held in." defaultValue={this.state.locationName} style={{marginTop: 0, marginRight: 0}}/>
          <label style={{fontSize: opts.fontSize}} className="input-label">Street Address</label>
          <input className={opts.inputClass} type="text" id="streetAddress" ref="streetAddress" placeholder="Enter your location" defaultValue={this.state.streetAddress} style={{marginTop: 0, marginRight: 0}} />
          <div className="row">
            <div className="col" style={{width: "50%", marginRight: 10}}>
              <label style={{fontSize: opts.fontSize}} className="input-label">City</label>
              <input className={opts.inputClass} type="text" ref="city" defaultValue={this.state.city} style={{margin: 0}} />
            </div>
            <div className="col" style={{width: "25%", marginRight: 10}}>
              <label style={{fontSize: opts.fontSize}} className="input-label">State</label>
              <input className={opts.inputClass} type="text" ref="state" defaultValue={this.state.state} style={{margin: 0}} />
            </div>
            <div className="col" style={{width: "25%"}}>
              <label style={{fontSize: opts.fontSize}} className="input-label">Zip</label>
              <input className={opts.inputClass} type="text" ref="zip" defaultValue={this.state.zip} style={{margin: 0}} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderMobile(opts) {
    return this.renderDesktop();
    return this.renderBase({
      fontSize: "2.5em",
      inputClass: "large-input",
      checkboxDims: 25,
      margin: 20
    })
  }

  renderDesktop(opts) {
    return this.renderBase({
      fontSize: "1em",
      inputClass: "",
      checkboxDims: 10,
      margin: 10
    })
  }

}
