import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import { Link, browserHistory } from 'react-router';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import Sidebar from "react-sidebar";

import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import Headroom from 'react-headroom';
import FontAwesome from 'react-fontawesome';
import UserDropdown from "../users/user_dropdown.jsx";
import NotyDropdown from "../users/noty_dropdown.jsx";
import SidebarMenu from "../users/sidebar_menu.jsx";

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
          if(props.onLoad)
            props.onLoad()
        },
        onError: () => {
          if(props.onLoad)
            props.onLoad()
        }
      }),
      userMenuOpen: false,
      notificationsMenuOpen: false
    }
  }

  imgOrDefault() {
    var user = Meteor.user();
    if(user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  toggleUserMenu() {
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
          <Link to="/dashboard">
            <div className="row x-center">
              <div style={{position: "relative"}}>
                <img style={{width: 40, height: 40, borderRadius: "100%", margin: "0 10px"}} src={this.imgOrDefault()} />
              </div>
            </div>
          </Link>
          <div className="row x-center">
            <a href="#" className="row x-center" style={{cursor: "pointer"}} onClick={(e) => {
              e.preventDefault();this.setState({userMenuOpen: true})
            }}>
              <FontAwesome name="bars" style={{fontSize: 18}} />
            </a>
          </div>
          {
            // <UserDropdown active={this.state.userMenuOpen} clear={() => {this.setState({userMenuOpen: false})}} onAccessNotes={() => {
            //   this.setState({
            //     notificationsMenuOpen: true,
            //     userMenuOpen: false
            //   })
            // }} />
          }
        </div>
      );
    }
    else {
      userCred = (
        <div className="head-credentials">
          <LogInModal />
        </div>
      )
    }
    var createPath = ["/create","/events/create","/leagues/create","/brackets/create"];
    return (
      <div>
        <Headroom id="header" disableInlineStyles={true}>
          <header className="row x-center header">
            <div className="row x-center col-1">
              <div style={{marginLeft: 0, marginRight: 10}}>
                <Link to="/discover" className={`hub ${window.location.pathname == "/discover" ? "active" : ""}`}>
                  DISCOVER
                </Link>
                {
                  Meteor.userId() ? (
                    <Link className={`hub ${createPath.indexOf(window.location.pathname) >= 0 ? "active" : ""}`} to="/create">
                      CREATE
                    </Link>
                  ) : (
                    <a href="#" className={`hub ${createPath.indexOf(window.location.pathname) >= 0 ? "active" : ""}`} onClick={ (e) => {
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
                <Link className="hub" to="/discover">
                  MARKET
                </Link>*/}
              </div>
            </div>
            <div className="col-1 row center">
              <div>
                <img style={{width: 40, height: "auto"}} src="/images/brachyon_logo_trans.png" onClick={() => {browserHistory.push("/")}}></img>
              </div>
            </div>
            <div style={{justifyContent: "flex-end"}} className="col-1 row x-center">
              {userCred}
            </div>
          </header>
        </Headroom>
        <Sidebar sidebar={<SidebarMenu onRedirect={this.toggleUserMenu.bind(this)} />} open={this.state.userMenuOpen} onSetOpen={this.toggleUserMenu.bind(this)} pullRight={true} sidebarClassName="sidebar">
        </Sidebar>
      </div>
    )
  }
}
