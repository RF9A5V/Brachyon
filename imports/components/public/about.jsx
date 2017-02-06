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
    });
  }

  componentWillUnmount() {
    this.state.user.stop();
    this.state.events.stop();
  }

  handleResize(e) {
    var blocks = Array.from(document.querySelectorAll(".about-blocks"));
    if(blocks.length == 0) {
      return;
    }
    blocks.forEach((block) => {
      var style = window.getComputedStyle(block);
      block.style.height = style.width;
    })
  }

  componentDidUpdate() {
    this.handleResize();
  }

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
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
    this.handleResize();
    if(!this.state.user.ready() || !this.state.events.ready()){
      return (
        <div>
        </div>
      )
    }
    var createEvent = "";
    if(Meteor.userId()) {
      createEvent = (
        <div className="col-to-row x-center col-1">
          <Link to="/events/create" className="col center x-center about-blocks">
            <FontAwesome name="plus" size="5x" className="about-icons" />
          </Link>
          <Link to="events/create" className="col about-desc">
            <h3 style={{marginTop: 10}}>Create</h3><div style={{marginTop: 10}}>Generate competitive events in seconds.</div>
          </Link>
        </div>
      );
    }
    else {
      if(this.state.clicked){
        createEvent = (
          <div className="col-to-row x-center col-1">
            <div id="about-block-cred" className="col center x-center">
              <LogInModal />
              <SignUpModal />
            </div>
            <div className="col about-desc">
              <h3 style={{marginTop: 10}}>Create</h3><div style={{marginTop: 10}}>Generate competitive events in seconds.</div>
            </div>
          </div>
        );
      }
      else {
        createEvent = (
          <div className="col-to-row x-center col-1">
            <div onClick={this.toggleCreate.bind(this)} className="col center x-center about-blocks">
              <FontAwesome name="plus" size="5x" className="about-icons" />
            </div>
            <div onClick={this.toggleCreate.bind(this)} className="col about-desc">
              <h3 style={{marginTop: 10}}>Create</h3><div style={{marginTop: 10}}>Generate competitive events in seconds.</div>
            </div>
          </div>
        );
      }
    }
    return(
      <div className="row center">
        <div className="col side-tab-panel">
          <h2 style={{margin: 0}}>What is Brachyon?</h2>
          <div className="about-what">
            Welcome to Brachyon - the eSports integrated experience where
            tournament organizers run, fund, and promote events for competitive gamers.
            Brachyon makes it easy to build successful events, empowering competitive communities from the
            ground up.
          </div>
          <h4>Brachyon Lets You...</h4>
          <div className="col" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <div className="row-to-col center x-center">
              <Link to="/discover" className="col-to-row x-center col-1">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="search" size="5x" className="about-icons" />
                </div>
                <div className="col about-desc">
                  <h3 style={{marginTop: 10}}>Search</h3><div style={{marginTop: 10}}>Quickly find events by area, game and time.</div>
                </div>
              </Link>
              {createEvent}
              <Link to="/advertise" className="col-to-row x-center col-1">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="arrow-up" size="5x" className="about-icons" />
                </div>
                <div className="col about-desc">
                  <h3 style={{marginTop: 10}}>Promote</h3><div style={{marginTop: 10}}>Share and publicize your events.</div>
                </div>
              </Link>
              <div className="col-to-row x-center col-1">
                <div className="col center x-center about-blocks">
                  <FontAwesome name="usd" size="5x" className="about-icons" />
                </div>
                <div className="col about-desc">
                  <h3 style={{marginTop: 10}}>Fund</h3><div style={{marginTop: 10}}>Make your event a reality with unique crowdfunding options.</div>
                </div>
              </div>
            </div>
          </div>
          <h4>Which Leads To...</h4>
          <div style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
            <div style={{marginLeft: 10}}>
              <BlockContainer events={this.promotedEvents()} />
            </div>
          </div>
          <h4>Why?</h4>
          <div className="about-what">
            <p>We love competitive gaming. Nothing catered to our needs
            as competitors, so we built it ourselves.</p>
            <p>Brachyon formed out of our pure love for the game.</p>
          </div>
        </div>
      </div>
    );
  }
}
