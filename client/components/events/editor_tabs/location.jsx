import React from 'react';
import GoogleMap from 'google-map-react';

import EventLocationForm from './location_form.jsx';

export default class EventLocation extends React.Component {
  componentWillMount() {
    this.setState({
      center: [this.props.lat, this.props.lng],
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
      </GoogleMap>
    )
  }

  updateMap(lat, lng, attrs) {
    console.log(this);
    console.log(lat, lng);
    center = [lat, lng];
    this.setState({center});
    console.log(attrs);
    Events.update(this.props.id, {
      $set: {
        location: attrs
      }
    })
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
