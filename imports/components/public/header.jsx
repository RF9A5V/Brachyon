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

  constructor () {
    super();
    this.state = {
      hover: false
    }
  }

  mouseOver() {
    this.setState({hover: true});
  }

  mouseOut() {
    this.setState({hover: false});
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
    if(this.state.hover){
      hub=(
        <div className = "hub-show">
          <Link className="hub" to="/events/discover">
            DISCOVER
          </Link>
          <Link className="hub" to="/events/discover">
            CREATE
          </Link>
          <Link className="hub" to="/events/discover">
            MARKET
          </Link>
          <Link className="hub" to="/about">
            ABOUT
          </Link>
        </div>
      )
    }
    else{
      hub=(
        <div className = "hub-hide">
          <Link className="hub" to="/events/discover">
            DISCOVER
          </Link>
          <Link className="hub" to="/events/discover">
            CREATE
          </Link>
          <Link className="hub" to="/events/discover">
            MARKET
          </Link>
          <Link className="hub" to="/about">
            ABOUT
          </Link>
        </div>
      )
    }
    return (
      <Headroom>
        <header onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)} className="row x-center header">
          <div className = "head-align row">
            <Link to="/">
              <img src="/images/b_logo_trans.png"></img>
            </Link>
            <input type="search" placeholder="Search Brachyon" style={{margin: 0}} />
            <button>
              <FontAwesome name="search"/>
            </button>
            {hub}
          </div>
          <div style={{justifyContent: "flex-end"}} className="col-1 row x-center">
            {userCred}
          </div>
        </header>
      </Headroom>
    )
  }
}
