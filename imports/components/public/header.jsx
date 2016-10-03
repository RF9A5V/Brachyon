import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import { ProfileImages } from "/imports/api/users/profile_images.js";

import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import Headroom from 'react-headroom';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';
import UserDropdown from "../users/user_dropdown.jsx";

export default class Header extends TrackerReact(Component) {

  onClick(e) {
    e.preventDefault();
    Meteor.logout(function(err) {
      if(!err) browserHistory.push("/");
    });
  }

  constructor () {
    super();
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId()),
      userMenuOpen: false
    }
  }

  imgOrDefault() {
    var profile = Meteor.user().profile;
    if(profile && profile.imageUrl) {
      return profile.imageUrl;
    }
    return "/images/profile.png";
  }

  toggleUserMenu(e) {
    e.preventDefault();
    this.setState({
      userMenuOpen: !this.state.userMenuOpen
    });
  }

  render() {
    if(!this.state.user.ready()){
      return (
        <div>
        </div>
      )
    }
    var userCred = "";
    if(Meteor.userId()){
      userCred = (
        <div style={{position: "relative"}} className="row x-center" onMouseEnter={() => { this.setState({userMenuOpen: true}) }} onMouseLeave={() => { this.setState({userMenuOpen: false}) }}>
          <Link to="/dashboard">
            <img style={{width: 50, height: 50, borderRadius: "100%", padding: "0 10px"}} src={this.imgOrDefault()} />
          </Link>
          <div className="no-select row x-center">
            <div className="col">
              <span className="bold" style={{fontSize: 20, marginRight: 20, marginBottom: 5}}>{Meteor.user().profile.alias || Meteor.user().username}</span>
            </div>
            <a href="#" className="row x-center" style={{lineHeight: "32px"}}>
              <FontAwesome style={{position: "relative", bottom: 7}} name="sort-desc" size="2x" />
            </a>
          </div>
          <UserDropdown active={this.state.userMenuOpen} clear={() => {this.setState({userMenuOpen: false})}} />
        </div>
      );
    }
    else {
      userCred = (
        <div className="head-credentials">
          <SignUpModal />
          <LogInModal />
        </div>
      )
    }
    return (
      <Headroom id="header" disableInlineStyles={true}>
        <header className="row x-center header">
          <div className="row x-center">
            <img src="/images/logo.png" style={{width: "60px", height: "auto", cursor: "pointer"}} onClick={() => {browserHistory.push("/")}}></img>
            <div style={{marginLeft: 10, marginRight: 10}}>
              <Link to="/events/discover" className={`hub ${window.location.pathname == "/events/discover" ? "active" : ""}`}>
                DISCOVER
              </Link>
              {/*<Link className="hub" to="/events/discover">
                CREATE
              </Link>
              <Link className="hub" to="/events/discover">
                MARKET
              </Link>*/}
              <Link to="/about" className={`hub ${window.location.pathname == "/about" ? "active" : ""}`}>
                ABOUT
              </Link>
            </div>
          </div>
          <div style={{justifyContent: "flex-end"}} className="col-1 row x-center">
            {userCred}
          </div>
        </header>
      </Headroom>
    )
  }
}
