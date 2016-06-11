import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'

import GoogleMapsLoader from 'google-maps';

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    this.setState({
      event: Meteor.subscribe('event', this.props.params.eventId),
      apiLoaded: false
    })

    GoogleMapsLoader.load(function(google){
      self.setState({apiLoaded: true})
    });

  }

  componentWillUnmount(){
    this.state.event.stop();
    GoogleMapsLoader.release();
  }

  event() {
    return Events.find().fetch()[0];
  }

  banner() {
    return Images.find().fetch()[0];
  }

  location() {
    event = this.event();
    if(this.event()){
      return (
        <div>
          <div>
            <span>{event.location.locationName}</span>
          </div>
          <div>
            <span>{event.location.streetAddress}</span>
          </div>
          <div>
            <span>{`${event.location.city} ${event.location.state}, ${event.location.zip}`}</span>
          </div>
        </div>
      );
    }
    return (
      <div>

      </div>
    )
  }

  render() {
    if(this.event() == null || this.banner() == null){

      return (
        <div>
        </div>
      )
    }
    event = this.event();
    banner = this.banner();
    return (
      <div>
        <h1 style={{marginTop: 20, marginLeft: 20}}>
          {event.title}
        </h1>
        <div className="row">
          <div className="col-2" style={{padding: 20, textAlign: 'center'}}>
            No Sponsorship
          </div>
          <div className="col-3" style={{width:'50%'}} style={{padding: 20}}>
            <div className="description-container" dangerouslySetInnerHTML={{__html: event.description}}></div>
          </div>
          <div className="col-2">
            <img src={banner.url()} style={{width: '100%', height: 'auto'}}/>
            <div style={{padding: 20}}>
              {this.location()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
