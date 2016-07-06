import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import Headroom from 'react-headroom';
import FontAwesome from 'react-fontawesome';

export default class Header extends TrackerReact(Component) {
  onClick(e) {
    e.preventDefault();
    Meteor.logout();
  }

  constructor () {
    super();
    this.state = {
      hover: false,
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
        <header onMouseEnter={this.mouseOver.bind(this)} onMouseLeave={this.mouseOut.bind(this)} class="row x-center header">
          <div className = "head-align row">
            <img src="/images/b_logo.svg" style={{height: 50, width:50}}></img>
            <Link to="/">
              <h2 style={{margin: 0}}>BRACHYON</h2>
            </Link>
            <input type="search" placeholder="Search Brachyon" style={{margin: 0}} />
            <button>
              <FontAwesome name="search"/>
            </button>
            {hub}
          </div>
          <div style={{textAlign: 'right'}} className="col-1">
            {userCred}
          </div>
        </header>
      </Headroom>
    )
  }
}
