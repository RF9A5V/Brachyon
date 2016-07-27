import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';

import BlockContainer from '/imports/components/events/discover/block_container.jsx';

export default class About extends TrackerReact(Component) {

  componentWillMount() {
    var self = this;
    this.setState({
      events: Meteor.subscribe('discoverEvents')
    })
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  promotedEvents() {
    return Events.find({"promotion.active": {$ne: null}}, {sort: {"promotion.bid": -1}, limit: 3}).fetch();
  }

  render() {
    return(
      <div className="about-layout">
        <div className="side-tab-content">
          <div className="side-tab-panel">
            <div className="row center"><h2>What is Brachyon?</h2></div>
            <div className="row center about-what font-stretch-mid">
              Welcome to Brachyon - a website which allows you to find, fund,
              create and promote competitive gaming events.
              Brachyon makes it easy to build passionate communities
              around competitive games.
            </div>
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Brachyon Lets You...</h2></div>
            <div className="row center">
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="search" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  <h3>Search</h3>Quickly search events by area, game and time.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="plus" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  <h3>Create</h3>Generate competitive events in seconds.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="arrow-up" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  <h3>Promote</h3>Share and publicize your events.
                </div>
              </div>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="usd" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc font-stretch-mid">
                  <h3>Fund</h3>Make your event a reality with unique crowdfunding options.
                </div>
              </div>
            </div>
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Which leads to...</h2></div>
              <BlockContainer events={this.promotedEvents()} />
          </div>
        </div>
      </div>
    );
  }
}
