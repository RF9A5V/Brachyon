import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import BlockContainer from '/imports/components/events/discover/block_container.jsx';

export default class AboutScreen extends TrackerReact(Component) {

  componentWillMount() {
    var self = this;
    this.setState({
      user: Meteor.subscribe("user", Meteor.userId()),
      events: Meteor.subscribe('discoverEvents'),
      clicked: false
    })
  }

  onClick(e) {
    e.preventDefault();
  }

  toggleCreate(e) {
    e.preventDefault();
    this.setState({
      clicked: true
    })
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  promotedEvents() {
    return Events.find({"promotion.active": {$ne: null}}, {sort: {"promotion.bid": -1}, limit: 3}).fetch();
  }

  render() {
    if(!this.state.user.ready()){
      return (
        <div>
        </div>
      )
    }
    var createEvent = "";
    if(Meteor.userId()) {
      createEvent = (
        <div>
          <Link to="/events/create">
            <div className="col center x-center about-blocks">
              <FontAwesome name="plus" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
            </div>
          </Link>
        </div>
      );
    }
    else {
      if(this.state.clicked){
        createEvent = (
          <div id="about-block-cred" className="col center x-center">
            <LogInModal />
            <SignUpModal />
          </div>
        );
      }
      else {
        createEvent = (
          <div onClick={this.toggleCreate.bind(this)} className="col center x-center about-blocks">
            <FontAwesome name="plus" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
          </div>
        );
      }
    }
    return(
      <div className="about-layout">
        <div className="side-tab-content">
          <div className="side-tab-panel">
            <div className="row center"><h2>What is Brachyon?</h2></div>
            <div className="row center">
              <div className="about-what">
                Welcome to Brachyon - a website which allows you to find,
                create, promote, and fund competitive gaming events.
                Brachyon makes it easy to build passionate communities
                around competitive games.
                Brachyon's mission is to empower competitive gaming communities from the
                ground up.
              </div>
            </div>
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Brachyon Lets You...</h2></div>
            <div className="row center">
              <Link to="/events/discover" className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="search" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc">
                  <h3>Search</h3>Quickly find events by area, game and time.
                </div>
              </Link>
              <div className="col">
                {createEvent}
                <div onClick={this.toggleCreate.bind(this)} className="col center x-center about-desc">
                  <h3>Create</h3>Generate competitive events in seconds.
                </div>
              </div>
              <Link to="/advertise" className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="arrow-up" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc">
                  <h3>Promote</h3>Share and publicize your events.
                </div>
              </Link>
              <div className="col">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="usd" style={{fontSize: "calc(3vw + 3vmin)"}} className="about-icons" />
                </div>
                <div className="col center x-center about-desc">
                  <h3>Fund</h3>Make your event a reality with unique crowdfunding options.
                </div>
              </div>
            </div>
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Which Leads To...</h2></div>
              <BlockContainer events={this.promotedEvents()} />
          </div>
          <div className="side-tab-panel">
            <div className="row center"><h2>Why?</h2></div>
            <div className="row center">
              <div className="about-what">
                We love competitive gaming. Nothing catered to our needs
                as competitors, so we built it ourselves. Brachyon formed out
                of our pure love for the game.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
