import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link } from 'react-router';
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
      hover: false,
      user: Meteor.subscribe("user", Meteor.userId()),
      userMenuOpen: false
    }
  }

  imgOrDefault() {
    var profile = ProfileImages.findOne(Meteor.user().profile.image);
    if(profile) {
      return profile.url();
    }
    return "/images/profile.png";
  }

  mouseOver() {
    this.setState({hover: true});
  }

  mouseOut() {
    this.setState({hover: false});
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
        <div style={{position: "relative"}} className="row x-center">
          <a href="#" onClick={ (e) => { e.preventDefault(); browserHistory.push("/dashboard") } }>
            <img style={{width: 75, height: 75, borderRadius: "100%"}} src={this.imgOrDefault()} />
          </a>
          <div className="col">
            <span style={{fontSize: 20, fontWeight: "bold", marginRight: 20, marginBottom: 5}}>{Meteor.user().profile.alias || Meteor.user().username}</span>
            <a href="#" className="row x-center" style={{margin: 0}} onClick={(e) => { e.preventDefault(); browserHistory.push("/buy_currency") }}>
              <div style={{width: 25, height: 25, backgroundColor: "gold", marginRight: 10, borderRadius: "100%"}}></div>
              <span style={{fontWeight: "bold"}}>
                {Meteor.user().profile.amount || 0}
              </span>
            </a>
          </div>
          <a href="#" className="row x-center" style={{lineHeight: "32px"}} onClick={this.toggleUserMenu.bind(this)}>
            <FontAwesome style={{position: "relative"}} name="sort-desc" size="2x" />
          </a>
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
    if(this.state.hover){
      hub=(
        <div className="hub-show">
          <Link className="hub" to="/events/discover">
            DISCOVER
          </Link>
          <Link className="hub" to="/about">
            ABOUT
          </Link>
        </div>
      )
    }
    else{
      hub=(
        <div className="hub-hide">
          <Link className="hub" to="/events/discover">
            DISCOVER
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
              <img src="/images/b_logo_trans.png" style={{height: 50, width:50}} />
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
