import React from 'react';
import GoogleMap from 'google-map-react';

import EventLocationForm from './location_form.jsx';

export default class EventLocation extends React.Component {
  componentWillMount() {
    latlng = !this.props.coords ? [1, 1] : this.props.coords.reverse();
    this.setState({
      center: latlng,
      zoom: 15,
      key: "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4",
      clicked: false
    });
  }

  map() {
    return (
      <GoogleMap
        center={this.state.center}
        zoom={this.state.zoom}
        bootstrapURLKeys={{key: this.state.key}}>
        <div style={{width:10, height:10, backgroundColor: 'black', borderRadius: '100%'}} lat={this.state.center[0]} lng={this.state.center[1]}></div>
      </GoogleMap>
    )
  }

  updateMap(attrs) {
    center = [attrs.coords[1], attrs.coords[0]];
    this.setState({center});
    Meteor.call('events.update_location', this.props.id, attrs, function(err){
      if(err){
        toastr.error(err.reason);
      }
      else{
        toastr.success("Successfully updated location!");
      }
    });
  }

  render(){
    self = this;
    if(this.state.clicked){
      return (
        <div className="row" style={{height: '50vh'}}>
          <EventLocationForm updateMap={this.updateMap.bind(this)} {...this.props} />
          <div className="col-1" style={{height: '50vh'}}>
            { this.map() }
          </div>
        </div>
      );
    }
    return (
      (<div className="row center x-center" onClick={(e)=>self.setState({clicked: true})}>Click me to load!</div>)
    );
  }
}
