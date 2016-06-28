import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DiscoverDisplay from './discover/display.jsx';
import DiscoverSearch from './discover/search.jsx';
import BlockContainer from './discover/block_container.jsx';

export default class EventDiscoveryScreen extends TrackerReact(Component) {

  constructor(){
    super();
    this.state = {
      events: Meteor.subscribe('events')
    }
  }

  componentWillUnmount(){
    this.events.stop();
  }

  events() {
    return Events.find().fetch();
  }

  setSubscription(params){
    this.state.events.stop();
    this.setState({
      events: Meteor.subscribe('event_search', params)
    })
  }

  render() {
    return (
      <div className="content">
        <DiscoverDisplay />
        <DiscoverSearch handler={this.setSubscription.bind(this)} />
        <BlockContainer events={this.events()} />
      </div>
    )
  }
}
