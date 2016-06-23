import React, { Component } from 'react';
import GoogleMapsLoader from 'google-maps';

export default class LocationSelect extends Component {

  componentWillMount() {

    this.setState({
      online: true
    })

    self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    GoogleMapsLoader.load(function(google){
      autocomplete = new google.maps.places.Autocomplete(
      (document.getElementById('test')),
      {types: ['geocode']});
      autocomplete.addListener('place_changed', function(){
        lat = autocomplete.getPlace().geometry.location.lat();
        lng = autocomplete.getPlace().geometry.location.lng();

        // Longitude and Latitude are intentionally set backwards because MongoDB is dumb. DO NOT SWITCH
        self.setState({
          type: "Point",
          coords: [ lng, lat ]
        });
      })
    });
  }

  componentWillUnmount() {
    GoogleMapsLoader.release();
  }

  updateValue(e){
    this.setState({
      online: e.target.value == 'true'
    });
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
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={true} /> Yes
            <input onChange={this.updateValue.bind(this)} name="online" type="radio" value={false} /> No
          </div>
          <div style={this.state.online ? { display: 'none' } : {}}>
            <input type="text" id="test" ref="location" placeholder="Enter your location" />
          </div>
        </label>
      </div>
    )
  }
}
