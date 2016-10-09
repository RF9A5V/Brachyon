import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DisplayDiscover from './display_discover.jsx';
import DiscoverSearch from './search.jsx';
import BlockContainer from './block_container.jsx';

export default class EventDiscoveryScreen extends TrackerReact(Component) {

  componentWillMount() {
    var self = this;
    this.setState({
      events: Meteor.subscribe('discoverEvents'),
      promotedEvents: Meteor.subscribe("promotedEvents"),
      query: {}
    })
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  events() {
    return Events.find(this.state.query, {sort: {"promotion.bid": -1, "details.datetime": -1}}).fetch();;
  }

  promotedEvents() {
    return Events.find({"promotion.active": {$ne: null}}, {sort: {"promotion.bid": -1}, limit: 5}).fetch();
  }

  setSubscription(params, query){
    this.state.events.stop();
    this.setState({
      events: Meteor.subscribe('searchEvents', params),
      query
    });
  }

  render() {
    return (
      <div className="content col-1 x-center">
        {
          this.state.promotedEvents.ready() ? (
            <DisplayDiscover events={this.promotedEvents()} />
          ) : (
            ""
          )
        }
        <div className="row col-1"><hr className="discover-divider"></hr></div>
        <DiscoverSearch handler={this.setSubscription.bind(this)} ref="search" />
        <div style={{padding: "0 5em"}}>
          {
            this.state.events.ready() ? (
              <BlockContainer events={this.events()} />
            ) : (
              <div></div>
            )
          }
        </div>
      </div>
    )
  }
}
