import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import FontAwesome from "react-fontawesome";
import Sidebar from "react-sidebar";
import Headroom from 'react-headroom';

import { ProfileImages } from "/imports/api/users/profile_images.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import SignUpModal from './signupmodal.jsx';
import LogInModal from './loginmodal.jsx';
import SidebarMenu from "../users/sidebar_menu.jsx";
import GlobalMenu from "/imports/components/public/global_side_nav.jsx";

class Header extends ResponsiveComponent {

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
      navMenuOpen: false
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

  renderMobile() {
    if(!this.props.ready){
      return (
        <div>
        </div>
      )
    }
    const user = Meteor.user();
    return (
      <div>
        <Headroom id="header" disableInlineStyles={true}>
          <div className="row x-center" style={{backgroundColor: "black", height: "9em", width: "100vw", padding: 20, zIndex: 5}}>
            <div className="col-1">
              <FontAwesome name="bars" style={{fontSize: "5em"}} onClick={() => {
                console.log("one")
                this.setState({ navMenuOpen: true })
              }}/>
            </div>
            <img src="/images/brachyon_logo_trans.png" style={{width: "8em", height: "auto"}} onClick={() => {
              browserHistory.push("/");
            }} />
            <div className="col-1 row" style={{justifyContent: "flex-end"}}>
              {
                user ? (
                  <img src={user.profile.imageUrl || "/images/profile.png"} style={{width: "7.5em", height: "7.5em", borderRadius: "100%"}} onClick={() => {
                    console.log("two")
                    this.setState({ userMenuOpen: true })
                  }} />
                ) : (
                  null
                )
              }
            </div>
          </div>
        </Headroom>
        <Sidebar sidebar={<SidebarMenu onRedirect={this.toggleUserMenu.bind(this)} />} open={this.state.userMenuOpen} onSetOpen={this.toggleUserMenu.bind(this)} pullRight={true} sidebarClassName="sidebar"></Sidebar>
        <Sidebar sidebar={
          <GlobalMenu closeMenu={() => { this.setState({navMenuOpen: false}) }} />
        } open={this.state.navMenuOpen} onSetOpen={() => {
          this.setState({ navMenuOpen: !this.state.navMenuOpen })
        }} pullRight={false} sidebarClassName="sidebar">
        </Sidebar>
      </div>
    )
  }

  renderDesktop() {
    if(!this.props.ready){
      return (
        <div>
        </div>
      )
    }
    var userCred = "";
    if(Meteor.userId()){
      userCred = (
        <div style={{position: "relative"}} className="row x-center">
          <div className="row x-center" onClick={(e) => {
            e.preventDefault();this.setState({userMenuOpen: true})
          }}>
            <div style={{position: "relative"}}>
              <img style={{width: 40, height: 40, borderRadius: "100%"}} src={this.imgOrDefault()} />
            </div>
          </div>
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

export default createContainer((props) => {
  const sub = Meteor.subscribe("user", Meteor.userId())
  return {
    ready: sub.ready()
  }
}, Header)
