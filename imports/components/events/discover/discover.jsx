import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import DisplayDiscover from './display_discover.jsx';
import DiscoverSearch from './search.jsx';
import BlockContainer from './block_container.jsx';
import AltBlockContainer from "/imports/components/generic/block_container.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class EventDiscoveryScreen extends TrackerReact(ResponsiveComponent) {

  componentWillMount() {
    super.componentWillMount();
    this.setState({
      events: Meteor.subscribe('discoverEvents'),
      promotedEvents: Meteor.subscribe("promotedEvents"),
      query: {
        league: null
      },
      ready: false
    })
  }

  componentWillUnmount(){
    super.componentWillUnmount();
    this.state.events.stop();
    this.state.promotedEvents.stop();
  }

  events() {
    return Events.find(this.state.query, {sort: {"promotion.bid": -1, "details.datetime": -1}}).fetch();;
  }

  promotedEvents() {
    return Events.find({"promotion.active": true, league: null}, {sort: {"promotion.bid": -1}, limit: 5}).fetch();
  }

  promotedCollections(){
    var leagues = Leagues.find({"promotion.active":true}).map(obj=> {
      obj.type="league";
      return obj});
    var events = Events.find({"promotion.active":true}).map(obj=>{
      obj.type="event"
      return obj});
    var combo = leagues.concat(events);
    combo.sort((a,b)=>{
      return (a.promotion.bid-b.promotion.bid>0? -1:1)
      });
    if(combo.length>5)
      combo.length=5;

    return combo;
  }

  setSubscription(params, query){
    this.state.events.stop();
    this.setState({
      events: Meteor.subscribe('searchEvents', params),
      query
    });
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.state.events.ready()} onReady={() => { this.setState({ ready: true }) }} />
      )
    }
    return (
      <div className="col-1 x-center" style={{marginBottom: opts.marginBottom}}>
        {
          this.state.promotedEvents.ready() ? (
            <DisplayDiscover events={this.promotedCollections()} />
          ) : (
            ""
          )
        }
        <div className="row col-1"><hr className="discover-divider"></hr></div>
        {/*<DiscoverSearch handler={this.setSubscription.bind(this)} ref="search" />*/}
        <div style={{padding: `0 ${opts.pad}`}}>
          {
            this.state.events.ready() ? (
              <AltBlockContainer />
            ) : (
              <div></div>
            )
          }
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      marginBottom: 200,
      pad: "10px"
    })
  }

  renderDesktop() {
    return this.renderBase({
      marginBottom: 200,
      pad: "5em"
    })
  }
}
