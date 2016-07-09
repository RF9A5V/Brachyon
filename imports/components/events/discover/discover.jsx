import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DiscoverDisplay from './display_discover.jsx';
import DiscoverSearch from './search.jsx';
import BlockContainer from './block_container.jsx';

export default class EventDiscoveryScreen extends TrackerReact(Component) {

  componentWillMount() {
    var self = this;
    this.setState({
      events: Meteor.subscribe('discoverEvents', {
        onReady() {
          self.setState({
            loaded: true
          })
        }
      }),
      loaded: false
    })
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  events() {
    return Events.find({},{sort: {"details.datetime": -1}}).fetch();
  }

  promotedEvents() {
    console.log(Events.find({"promotion.active": {$ne: null}}, {sort: {"promotion.bid": -1}}).fetch());
  }

  setSubscription(params){
    this.state.events.stop();
    this.setState({
      events: Meteor.subscribe('event_search', params)
    })
  }

  render() {
    if(!this.state.loaded){
      return (
        <div>
        </div>
      )
    }
    this.promotedEvents();
    return (
      <div className="content">
        <DiscoverDisplay />
        <DiscoverSearch handler={this.setSubscription.bind(this)} />
        <BlockContainer events={this.events()} />
      </div>
    )
  }
}
