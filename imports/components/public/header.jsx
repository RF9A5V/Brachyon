import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link, browserHistory } from 'react-router';
import { ProfileImages } from "/imports/api/users/profile_images.js";

import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import Headroom from 'react-headroom';
import FontAwesome from 'react-fontawesome';
import UserDropdown from "../users/user_dropdown.jsx";
import NotyDropdown from "../users/noty_dropdown.jsx";

export default class Header extends TrackerReact(Component) {

  onClick(e) {
    e.preventDefault();
    Meteor.logout(function(err) {
      if(!err) browserHistory.push("/");
    });
  }

  constructor (props) {
    super(props);
    this.state = {
      user: Meteor.subscribe("user", Meteor.userId(), {
        onReady: () => {
          props.onLoad()
        },
        onError: () => {
          props.onLoad()
        }
      }),
      userMenuOpen: false,
      notificationsMenuOpen: false
    }
  }

  imgOrDefault() {
    var user = Meteor.user();
    if(user.profile.image != null) {
      return ProfileImages.findOne(user.profile.image).link();
    }
    return "/images/profile.png";
  }

  toggleUserMenu(e) {
    e.preventDefault();
    this.setState({
      userMenuOpen: !this.state.userMenuOpen
    });
  }

  removeNotifications() {
    this.setState({
      notificationsMenuOpen: false
    })
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
        <div style={{position: "relative"}} className="row x-center">
          <Link to="/dashboard">
            <div className="row x-center">
              <div style={{position: "relative"}}>
                <img style={{width: 50, height: 50, borderRadius: "100%", padding: "0 10px"}} src={this.imgOrDefault()} />
                <div style={{position: "absolute", bottom: -5, right: 5}} onClick={(e) => { e.preventDefault(); e.stopPropagation(); this.setState({ notificationsMenuOpen: !this.state.notificationsMenuOpen }) }}>
                  <NotyDropdown open={this.state.notificationsMenuOpen} />
                </div>
              </div>
              <div className="col">
                <span className="bold" style={{fontSize: 20, marginRight: 20, marginBottom: 5}}>{Meteor.user().profile.alias || Meteor.user().username}</span>
              </div>
            </div>
          </Link>
          <div className="row x-center">
            <a href="#" className="row x-center" style={{lineHeight: "32px", cursor: "pointer"}} onClick={(e) => { e.preventDefault();this.setState({userMenuOpen: !this.state.userMenuOpen}) }}>
              <FontAwesome style={{position: "relative", bottom: 7}} name="sort-desc" size="2x" />
            </a>
          </div>
          <UserDropdown active={this.state.userMenuOpen} clear={() => {this.setState({userMenuOpen: false})}} onAccessNotes={() => { this.setState({ userMenuOpen: false, notificationsMenuOpen: true }) }} />
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
        <header className="row x-center header" onMouseLeave={() => {
          if(this.state.userMenuOpen || this.state.notificationsMenuOpen) {
            this.state.timeout = setTimeout(() => {
              this.setState({userMenuOpen: false, notificationsMenuOpen: false});
            }, 1000);
          }
        }} onMouseEnter={() => {
          if(this.state.userMenuOpen || this.state.notificationsMenuOpen) {
            clearTimeout(this.state.timeout);
          }
        }} onClick={this.removeNotifications.bind(this)}>
          <div className="row x-center">
            <img src="/images/logo.png" onClick={() => {browserHistory.push("/")}}></img>
            <div style={{marginLeft: 10, marginRight: 10}}>
              <Link to="/events/discover" className={`hub ${window.location.pathname == "/events/discover" ? "active" : ""}`}>
                DISCOVER
              </Link>
              {
                Meteor.userId() ? (
                  <Link className={`hub ${window.location.pathname == "/events/create" ? "active" : ""}`} to="/events/create">
                    CREATE
                  </Link>
                ) : (
                  <a href="#" className={`hub ${window.location.pathname == "/events/create" ? "active" : ""}`} onClick={ (e) => {
                    e.preventDefault();
                    toastr.warning("Please log in or sign up before creating an event!", "Warning!");
                    browserHistory.push("/")
                  } }>
                    CREATE
                  </a>
                )
              }
              <Link className={`hub ${window.location.pathname == "/games/index" ? "active" : ""}`} to="/games/index">
                GAMES
              </Link>
              {/*
              <Link className="hub" to="/events/discover">
                MARKET
              </Link>*/}
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
