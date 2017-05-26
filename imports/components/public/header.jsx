import React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Link, browserHistory } from 'react-router';
import FontAwesome from "react-fontawesome";
import Sidebar from "react-sidebar";
import Headroom from 'react-headroom';

import Loader from "/imports/components/public/loader.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

import SidebarMenu from "../users/sidebar_menu.jsx";
import GlobalMenu from "/imports/components/public/global_side_nav.jsx";
import RegModal from "/imports/components/public/reg_modal.jsx";

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
    var user = Meteor.users.findOne(Meteor.userId());
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

  statusIcon() {
    var color = "#5BD74D";
    return (
      <div className="row x-center col-1">
        <div style={{width: 10, height: 10, backgroundColor: color, marginRight: 10}}>
        </div>
        <span style={{fontSize: "1.1rem"}}>Online</span>
      </div>
    )
  }

  userStatus() {
    const user = Meteor.user();
    return (
      <div className="row" style={{width: 230, cursor: "pointer"}} onClick={() => {
        this.setState({ userMenuOpen: true })
      }}>
        <img src={user.profile.imageUrl || "/images/profile.png"} style={{width: 40, height: 40, borderRadius: "100%", marginRight: 10}} />
        <div className="col">
          <span style={{fontSize: "1.4rem", fontWeight: "bold"}}>{ user.username }</span>
          {
            this.statusIcon()
          }
        </div>
      </div>
    )
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
                this.setState({ navMenuOpen: true })
              }}/>
            </div>
            <div onClick={() => {
              if(user) {
                browserHistory.push("/user/" + user.username);
              }
            }}>
              <Loader width={100} />
            </div>
            <div className="col-1 row" style={{justifyContent: "flex-end"}}>
              {
                user ? (
                  <img src={user.profile.imageUrl || "/images/profile.png"} style={{width: "7.5em", height: "7.5em", borderRadius: "100%"}} onClick={() => {
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
    const user = Meteor.user();
    if(Meteor.userId()){
      userCred = (
        <div className="col-1 row" style={{justifyContent: "flex-end"}}>
          {
            user ? (
              this.userStatus()
            ) : (
              null
            )
          }
        </div>
      );
    }
    else {
      userCred = [
        <button className="login-button" style={{marginRight: 10}} onClick={() => {
          this.setState({ regOpen: true, content: "login" })
        }}>Log In</button>,
        <button className="signup-button" onClick={() => {
          this.setState({ regOpen: true, content: "signup" })
        }}>Sign Up</button>
      ]
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
                      if(user) {
                        browserHistory.push("/user/" + user.username);
                      }
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
            <div className="row center x-center" onClick={() => {
              if(user) {
                browserHistory.push("/user/" + user.username);
              }
            }} style={{cursor: "pointer"}}>
              <Loader width={40} />
            </div>
            <div style={{justifyContent: "flex-end"}} className="col-1 row x-center">
              {userCred}
            </div>
          </header>
        </Headroom>
        <Sidebar sidebar={<SidebarMenu onRedirect={this.toggleUserMenu.bind(this)} />} open={this.state.userMenuOpen} onSetOpen={this.toggleUserMenu.bind(this)} pullRight={true} sidebarClassName="sidebar">
        </Sidebar>
        <RegModal open={this.state.regOpen} content={this.state.content} onClose={() => {
          this.setState({ regOpen: false })
        }} onSuccess={() => {
          if(window.location.pathname == "/") {
            browserHistory.push("/discover");
          }
          this.setState({ regOpen: false })
        }} />
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
