import React, { Component } from "react";
import GoogleMapsLoader from "google-maps";

export default class LocationSelect extends Component {

  componentWillMount() {

    this.setState({
      online: this.props.online,
      coords: [],
      streetAddress: "",
      city: "",
      state: "",
      zip: ""
    })

    var self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ["geometry", "places"];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (self.refs.streetAddress),
      {types: ["address"]});

      if(self.props.coords){
        var latLng = {
          lat: self.props.coords[1],
          lng: self.props.coords[0]
        };
        (new google.maps.Geocoder).geocode({location: latLng }, function(rez, status){
          if(status === google.maps.GeocoderStatus.OK){

            var parser = (function() {
              var [ city, state, zip ] = [ null, null, null ];
              rez[0].address_components.forEach(function(val){
                if(city == null && val.types.indexOf("locality") >= 0){
                  city = val.short_name
                }
                else if(state == null && val.types.indexOf("administrative_area_level_1") >= 0) {
                  state = val.short_name;
                }
                else if(zip == null && val.types.indexOf("postal_code") >= 0) {
                  zip = val.short_name;
                }
              });
              return [city, state, zip];
            })();

            self.setState({
              streetAddress: rez[0].address_components[0].long_name + " " + rez[0].address_components[1].long_name,
              city: parser[0],
              state: parser[1],
              zip: parser[2]
            });
          }
        })
      }

      autocomplete.addListener("place_changed", function() {

        var rez = autocomplete.getPlace();

        var [geo, comps] = [
          rez.geometry.location,
          rez.address_components
        ];

        var lat = geo.lat();
        var lng = geo.lng();

        // Longitude and Latitude are intentionally set backwards because MongoDB is dumb. DO NOT SWITCH
        var [ streetAddress, city, state, zip, coords ] = [
          comps[0].long_name + " " + comps[1].long_name,
          comps[3].long_name,
          comps[5].short_name,
          comps[7].long_name,
          [ lng, lat ]
        ];

        self.setState({
          streetAddress,
          city,
          state,
          zip,
          coords
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
    this.state.online = (e.target.value == 0);
    this.forceUpdate();
  }

  value() {
    if(this.state.online){
      return {
        online: true
      }
    }
    return {
      online: false,
      coords: this.state.coords
    }
  }

  render() {
    return (
      <div>
        <label>
          Is this event online?
        </label>
        <div>
          <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={0} checked={this.state.online} />
          <label>Yes</label>
          <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={1} checked={!this.state.online} />
          <label>No</label>
        </div>
        <div className="col" style={{display: this.state.online ? "none" : ""}}>
          <label>Address</label>
          <input type="text" id="streetAddress" ref="streetAddress" placeholder="Enter your location" style={{margin: 0}} defaultValue={this.state.streetAddress} />
          <div className="row" style={{marginTop: 10}}>
            <div className="col" style={{width: "50%"}}>
              <label>City</label>
              <input type="text" ref="city" defaultValue={this.state.city} />
            </div>
            <div className="col" style={{width: "25%"}}>
              <label>State</label>
              <input type="text" ref="state" defaultValue={this.state.state} />
            </div>
            <div className="col" style={{width: "25%"}}>
              <label>Zip</label>
              <input type="text" ref="zip" defaultValue={this.state.zip} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
