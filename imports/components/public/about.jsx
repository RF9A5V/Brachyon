import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';

import BlockContainer from '/imports/components/events/discover/block_container.jsx';
import AltBlockContainer from "/imports/components/generic/block_container.jsx";
import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import Modal from 'react-modal';
import LogInScreen from './login.jsx';
import SignUpScreen from './signup.jsx';
import DisplayDiscover from '/imports/components/events/discover/display_discover.jsx';

import LoaderContainer from "/imports/components/public/loader_container.jsx";

export default class AboutScreen extends TrackerReact(ResponsiveComponent) {

  componentWillMount() {
    super.componentWillMount();
    var self = this;
    this.setState({
      user: Meteor.subscribe("user", Meteor.userId()),
      events: Meteor.subscribe('discoverEvents'),
      clicked: false,
      open: false,
      ready: false
    });
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.state.user.stop();
    this.state.events.stop();
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
    return Events.find({"promotion.active": {$eq: true}}, {sort: {"promotion.bid": -1}, limit: 1}).fetch().map(e => {
      e.type = "event";
      return e;
    });
  }
  events(){
    return Events.find({"promotion.active": {$ne: true}}, {limit: 1}).fetch().map(e => {
      e.type = "event";
      return e;
    });
  }
  closeModal(){
      this.setState({open: false});
  }

  render() {
    if(!this.state.ready){
      const ready = this.state.user.ready() && this.state.events.ready();
      return (
        <LoaderContainer ready={ready} onReady={() => { this.setState({ready: true}) }} />
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
            <h3>Create</h3><div style={{marginTop: 10}}>Generate competitive events in seconds.</div>
          </Link>
        </div>
      );
    }
    else {
      createEvent = (
        <div className="col-to-row x-center col-1">
          <div className="col center x-center about-blocks" onClick={() => {
            this.setState({
             open: true,
             content: "login"
           }) }}>
            <FontAwesome name="plus" size="5x" className="about-icons" />
          </div>
          <Modal
            className="create-modal"
            overlayClassName = "credential-overlay"
            isOpen={this.state.open}
            onRequestClose={this.closeModal.bind(this)}
          >
            <div className="row justify-end">
              <FontAwesome onClick={this.closeModal.bind(this)} name="times" size="2x" className="close-modal"/>
            </div>
            <div className="row center">
              <h5 onClick={() => { this.setState({ content: "login" }) }} style={{color: this.state.content == "login" ? "#00BDFF" : "white", cursor: "pointer"}}>LOG IN</h5>
              <h5 style={{marginLeft: 10, marginRight: 10}}>/</h5>
              <h5 onClick={() => { this.setState({ content: "signup" }) }} style={{color: this.state.content == "signup" ? "#00BDFF" : "white", cursor: "pointer"}}>SIGN UP</h5>
            </div>
            <div className="row col-1 x-center center">
              {
                this.state.content == "login" ? (
                  <LogInScreen />
                ) : (
                  <SignUpScreen />
                )
              }
            </div>
          </Modal>
          <div onClick={this.toggleCreate.bind(this)} className="col about-desc">
            <h3>Create</h3><div style={{marginTop: 10}}>Generate competitive events in seconds.</div>
          </div>
        </div>
      );
    }
    return(
      <div className={`col ${this.state.render == "mobile" ? "" : "side-tab-panel"}`} style={{padding: this.state.render == "mobile" ? 10 : 0}}>
        <h2 style={{margin: 0, textAlign: "center"}}>What is Brachyon?</h2>
        <div className="about-what">
          <p className="text-description border-blue">
            Welcome to Brachyon - the eSports integrated experience where
            tournament organizers run, fund, and promote events for competitive gamers.
            Brachyon makes it easy to build successful events, empowering competitive communities from the
            ground up.
          </p>
        </div>
        <h4>Brachyon Lets You...</h4>
        <div className="col about-what" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
          <div className="row-to-col center x-center">
            <Link to="/discover" className="col-to-row x-center col-1">
              <div className="col center x-center about-blocks">
                <FontAwesome name="search" size="5x" className="about-icons" />
              </div>
              <div className="col about-desc">
                <h3 >Search</h3><div style={{marginTop: 10}}>Quickly find events by area, game and time.</div>
              </div>
            </Link>
            {createEvent}
            <Link to="/advertise" className="col-to-row x-center col-1">
              <div className="col center x-center about-blocks">
                <FontAwesome name="arrow-up" size="5x" className="about-icons" />
              </div>
              <div className="col about-desc">
                <h3>Promote</h3><div style={{marginTop: 10}}>Share and publicize your events.</div>
              </div>
            </Link>
            <div className="col-to-row x-center col-1">
              <div className="col center x-center about-blocks">
                <FontAwesome name="usd" size="5x" className="about-icons" />
              </div>
              <div className="col about-desc">
                <h3>Fund</h3><div style={{marginTop: 10}}>Make your event a reality with unique crowdfunding options.</div>
              </div>
            </div>
          </div>
        </div>
        <h4>Which Leads To...</h4>
        <div className="about-what" style={{backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
          <div style={{margin:10}}>
          {this.promotedEvents().length == 0?
            (this.events().length>0 ?
              (<DisplayDiscover events={this.events()} />)
              :(<div><a style={{margin:"auto"}} href="./create">The opportunity to be the first event in Brachyon</a></div>))
            :(<DisplayDiscover events={this.promotedEvents()} />)}
          </div>
        </div>
        <h4>Why?</h4>
        <div className="about-what" style={{marginBottom: 0}}>
          <div className="text-description border-blue">
            <p>We love competitive gaming. Nothing catered to our needs
            as competitors, so we built it ourselves.</p>
            <p>Brachyon formed out of our pure love for the game.</p>
          </div>
        </div>
      </div>
    );
  }
}
