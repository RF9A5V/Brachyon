import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import Headroom from 'react-headroom';
import FontAwesome from 'react-fontawesome';
import { browserHistory } from 'react-router';

export default class Header extends TrackerReact(Component) {

  onClick(e) {
    e.preventDefault();
    Meteor.logout(function(err) {
      if(!err) browserHistory.push("/");
    });
  }

  render() {
    var userCred = "";
    if(Meteor.userId()){
      userCred = (
        <a href="#" onClick={this.onClick}>
          <button>Logout</button>
        </a>);
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
      <Headroom>
        <header className="row x-center header">
          <div className = "head-align row">
            <Link to="/">
              <img src="/images/b_logo_trans.png"></img>
            </Link>
            <input type="search" placeholder="Search Brachyon" style={{margin: 0}} />
            <button>
              <FontAwesome name="search"/>
            </button>
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
