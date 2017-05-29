import React, { Component } from "react";
import Sidebar from "react-sidebar";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import RegModal from "/imports/components/public/reg_modal.jsx";

export default class GlobalSideNav extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    }
  }

  render() {
    const user = Meteor.user();
    const style = {
      fontSize: "1.5em",
      padding: "1em",
      width: "100%"
    }
    const closeMenu = () => {
      this.props.closeMenu()
    }

    const faSize = "2.5rem";

    return (
      <div className="col" style={{width: "75vw", height: "100%", backgroundColor: "black"}}>
        <div className="row" style={{padding: 10, paddingBottom: 0}}>
          <FontAwesome name="times" style={{fontSize: 18}} onClick={() => {
            closeMenu()
          }} />
        </div>
        <div className="row x-center" style={style} onClick={() => {
          browserHistory.push("/discover");
          closeMenu();
        }}>
          <div className="row x-center col-1" style={{marginRight: "0.5em"}}>
            <FontAwesome className="col-1" name="compass" style={{fontSize: faSize, color: window.location.pathname.indexOf("discover") > 0 ? "#FF6000" : "white"}} />
          </div>
          <span className="col-3" style={{color: window.location.pathname.indexOf("discover") > 0 ? "#FF6000" : "white"}}>DISCOVER</span>
          <div className="col-1"></div>
        </div>
        <div className="row x-center" style={style} onClick={() => {
          browserHistory.push("/create");
          closeMenu();
        }}>
          <div className="row x-center col-1" style={{marginRight: "0.5em"}}>
            <FontAwesome className="col-1" name="plus" style={{fontSize: faSize, color: window.location.pathname.indexOf("create") > 0 ? "#FF6000" : "white"}} />
          </div>
          <span className="col-3" style={{color: window.location.pathname.indexOf("create") > 0 ? "#FF6000" : "white"}}>CREATE</span>
          <div className="col-1"></div>
        </div>
        <div className="row x-center" style={style} onClick={() => {
          browserHistory.push("/games/index");
          closeMenu();
        }}>
          <div className="row x-center col-1" style={{marginRight: "0.5em"}}>
            <FontAwesome className="col-1" name="gamepad" style={{fontSize: faSize, color: window.location.pathname.indexOf("games/index") > 0 ? "#FF6000" : "white"}} />
          </div>
          <span className="col-3" style={{color: window.location.pathname.indexOf("games/index") > 0 ? "#FF6000" : "white"}}>GAMES</span>
          <div className="col-1"></div>
        </div>
        <div className="col-1"></div>
        {
          user ? (
            null
          ) : (
            [
              (
                <div className="row x-center" style={style} onClick={() => {
                  this.setState({
                    open: true,
                    content: "login"
                  });
                  closeMenu()
                }}>
                  <div className="row x-center col-1" style={{marginRight: "0.5em"}}>
                    <FontAwesome className="col-1" name="sign-in" style={{fontSize: faSize}} />
                  </div>
                  <span className="col-3">LOG IN</span>
                  <div className="col-1"></div>
                </div>
              ),
              (
                <div className="row x-center" style={style} onClick={() => {
                  this.setState({
                    open: true,
                    content: "signup"
                  });
                  closeMenu()
                }}>
                  <div className="row x-center col-1" style={{marginRight: "0.5em"}}>
                    <FontAwesome className="col-1" name="user-plus" style={{fontSize: faSize}} />
                  </div>
                  <span className="col-3">SIGN UP</span>
                  <div className="col-1"></div>
                </div>
              )
            ]
          )
        }
        <RegModal open={this.state.open} onClose={() => {
          this.setState({
            open: false
          })
        }} content={this.state.content} />
      </div>
    )
  }
}
