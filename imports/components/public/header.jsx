import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import SignUpModal from './signupmodal.jsx'

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
        <div>
          <SignUpModal />
        </div>
      )
    }
    return (
      <header class="row x-center">
        <div className="col-1">
          <Link to="events/discover">
            Discover
          </Link>
        </div>
        <Link to="/">
          <h2 style={{margin: 0}}>BRACHYON</h2>
        </Link>
        <div style={{textAlign: 'right'}} className="col-1">
          {userCred}
        </div>
      </header>
    )
  }
}
