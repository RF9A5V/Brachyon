import React from 'react';
import ReactiveInput from '/imports/components/public/reactive_input.jsx';

export default class EventLocationForm extends React.Component {

  geocode(address){
    self = this;
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({address}, function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        latlng = results[0].geometry.location;
        comps = results[0].address_components;
        attrs = {
          locationName: self.refs.locationName.getValue(),
          streetAddress: comps[0].long_name + ' ' + comps[1].long_name,
          city: comps[3].long_name,
          state: comps[5].short_name,
          zip: comps[7].long_name,
          coords: [latlng.lng(), latlng.lat()]
        }
        self.props.updateMap(attrs);
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
