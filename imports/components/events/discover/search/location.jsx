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

  onKeyPress(e) {
    if(e.key == "Enter") {
      this.props.onSubmit();
    }
  }

  query() {
    if(!this.state.coords) {
      return {};
    }
    var currentObj = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: this.state.coords.reverse() // Necessary, because of how MongoDB does the calculations.
        },
        $maxDistance: this.refs.distance.value * 1609 || 16093
      }
    };
    return {
      "details.location.coords": currentObj
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col">
          <input type="text" id="locationInput" placeholder="Search by Location" ref="location" onKeyPress={this.onKeyPress.bind(this)} onSubmit={this.props.onChange.bind(this)} onChange={this.onLocationChange.bind(this)} />
        </div>
        {
          this.state.hasLocation ? (
            <div className="col" style={{marginLeft: 10}}>
              <input type="number" style={{width: 100}} placeholder="Distance" ref="distance" onKeyPress={this.onKeyPress.bind(this)} onSubmit={this.props.onSubmit.bind(this)} onChange={this.onDistanceChange.bind(this)}></input>
            </div>
          ) : (
            ""
          )
        }
      </div>
    )
  }
}
