import React, { Component } from "react";
import GoogleMapsLoader from 'google-maps';

export default class LocationSearch extends Component {

  constructor(props){
    super(props);
    this.state = {
      hasLocation: false,
      timer: null
    }
  }

  componentWillMount(){
    self = this;
    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('locationInput')),
      {types: ['geocode']});
      autocomplete.addListener('place_changed', function(){
        console.log("Gets to GMaps Handler");
        lat = autocomplete.getPlace().geometry.location.lat();
        lng = autocomplete.getPlace().geometry.location.lng();
        self.setState({
          coords: [lat, lng],
          hasLocation: true
        });
        self.props.onChange({
          coords: [lat, lng]
        })
      })
    });
  }

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  onDistanceChange() {
    this.props.onChange({
      coords: this.state.coords,
      distance: this.refs.distance.value * 1
    });
  }

  onLocationChange() {
    if(this.state.hasLocation){
      this.setState({
        hasLocation: false,
        coords: null
      });
      this.props.onChange(null);
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <label>Location</label>
          <input type="text" id="locationInput" placeholder="Search by Location" ref="location" onChange={this.onLocationChange.bind(this)} />
        </div>
        {
          this.state.hasLocation ? (
            <div className="col" style={{marginLeft: 10}}>
              <label>Distance</label>
              <input type="number" style={{width: 100, margin: 0}} placeholder="Distance" ref="distance" onChange={this.onDistanceChange.bind(this)}></input>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
