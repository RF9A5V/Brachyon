import React from 'react';
import ReactiveInput from '/client/components/public/reactive_input.jsx';

export default class EventLocationForm extends React.Component {

  geocode(address){
    self = this;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({address}, function(results, status){
      console.log(results);
      if(status == google.maps.GeocoderStatus.OK){
        latlng = results[0].geometry.location;
        comps = results[0].address_components.map((value) => { return value.long_name });
        attrs = {
          locationName: self.refs.locationName.getValue(),
          streetAddress: [comps[0], comps[1]].join(' '),
          city: comps[3],
          state: comps[5],
          zip: comps[7],
          lat: latlng.lat(),
          lng: latlng.lng()
        }
        self.props.updateMap(latlng.lat(), latlng.lng(), attrs);
      }
      else {
        console.log(status);
        console.log(results);
      }
    })
  }

  onSubmit(e){
    e.preventDefault();
    self = this;
    temp = _.without(Object.keys(self.refs).map((key) => {return self.refs[key].getValue()}), '').join('+');
    self.geocode(temp);
  }

  render() {
    return (
      <form className="location-input-form col col-1" onSubmit={this.onSubmit.bind(this)}>
        <ReactiveInput ref="locationName" placeholder="Location Name" value={this.props.locationName} />
        <ReactiveInput ref="streetAddress" placeholder="Street Address" value={this.props.streetAddress} />
        <ReactiveInput ref="city" placeholder="City" value={this.props.city} />
        <ReactiveInput ref="state" placeholder="State" value={this.props.state} />
        <ReactiveInput ref="zip" placeholder="ZIP" value={this.props.zip} />
        <div className="row center x-center">
          <input type="submit" value="Update" />
        </div>
      </form>
    );
  }
}
