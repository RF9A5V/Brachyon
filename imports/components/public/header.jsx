import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';

export default class Header extends TrackerReact(Component) {
  onClick(e) {
    e.preventDefault();
    Meteor.logout();
  }
  render() {
    var userCred = "";
    if(Meteor.userId()){
      userCred = (<a href="#" onClick={this.onClick}>Logout</a>);
    }
    else {
      userCred = (
        <div className="head2">
          <SignUpModal />
          <LogInModal />
        </div>
      )
    }
    return (
      <header class="row x-center header">
        <div className="col-1 head-align">
          <Link className="hub" to="events/discover">
            DISCOVER
          </Link>
          <span className="hub-bar">
            |
          </span>
          <Link className="hub" to="events/discover">
            CREATE
          </Link>
          <span className="hub-bar">
            |
          </span>
          <Link className="hub" to="events/discover">
            MARKET
          </Link>
          <span className="hub-bar">
            |
          </span>
          <Link className="hub" to="about">
            ABOUT
          </Link>
        </div>
        <div className = "head-align">
          <Link to="/">
            <h2 style={{margin: 0}}>BRACHYON</h2>
          </Link>
        </div>
        <div style={{textAlign: 'right'}} className="col-1">
          {userCred}
        </div>
      </header>
    )
  }
}
