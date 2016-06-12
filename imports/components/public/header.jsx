import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';

export default class Header extends TrackerReact(Component) {
  onClick(e) {
    e.preventDefault();
    Meteor.logout();
  }
  render() {
    var logOutLink = "";
    if(Meteor.userId()){
      logOutLink = (<a href="#" onClick={this.onClick}>Logout</a>);
    }
    else {

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
          {logOutLink}
        </div>
      </header>
    )
  }
}
