import React, { Component } from 'react'
import TrackerReact from 'meteor/ultimatejs:tracker-react'
import GoogleMapsLoader from 'google-maps';

import Ticketing from '/imports/api/ticketing/ticketing.js';

import TabController from '../public/tab_controller.jsx';
import CrowdfundingPanel from './view/crowdfunding.jsx';
import TicketPanel from './view/ticketing.jsx';

export default class PreviewEventScreen extends TrackerReact(Component) {

  componentWillMount(){
    self = this;

    GoogleMapsLoader.KEY = "AIzaSyB4ZpFxDyTtOaSNO35OdUgLmVlBBOsTiu4";
    GoogleMapsLoader.LIBRARIES = ['geometry', 'places'];

    this.setState({
      event: Meteor.subscribe('event', this.props.params.eventId, {
        onReady() {
          self.setState({
            loaded: true
          })
        }
      }),
      loaded: false,
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

  imgOrDefault() {
    if(this.props.banner == null){
      return '/images/balls.svg';
    }
    else {
      return this.props.banner;
    }
  }

  location() {
    var event = this.event();
    if(event){
      if(event.details.location.online){
        return (
          <div>
            <span>Online</span>
          </div>
        );
      }
      else{
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
    }
    return (
      <div>

      </div>
    )
  }

  tabs() {
    var event = this.event();
    var rez = [
      {
        title: 'Description',
        content: (<div className="description-container" dangerouslySetInnerHTML={{__html: event.details.description}}></div>)
      }
    ];
    if(Sponsorships.find().fetch()[0]){
      rez.push({
        title: 'Crowdfunding',
        content: <CrowdfundingPanel {...Sponsorships.find().fetch()[0]}/>
      });
    }
    if(Ticketing.find().fetch()[0]){
      rez.push({
        title: 'Tickets',
        content: <TicketPanel {...Ticketing.find().fetch()[0]} />
      })
    }
    return rez;
  }

  render() {
    if(!(this.state.loaded && this.state.apiLoaded)){
      return (
        <div>
        </div>
      )
    }
    var event = this.event();
    var banner = this.imgOrDefault();
    return (
      <div className="screen row">
        <div className="col-1 user-details">
          <img src={banner} style={{width: '100%', height: 'auto'}}/>
          <div style={{padding: 20}}>
            {this.location()}
          </div>
        </div>
        <div className="col-3">
          <h1 style={{marginTop: 20, marginLeft: 20, textAlign: 'center'}}>
            {event.title}
          </h1>
          <TabController tabs={this.tabs()} />
        </div>
      </div>
    );
  }
}
