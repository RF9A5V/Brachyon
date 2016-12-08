import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Notifications from "/imports/api/users/notifications.js";

export default class UserDropdown extends Component {

  accessOptions(e) {
    e.preventDefault();
    browserHistory.push("/options");
    this.props.clear();
  }

  accessProfile(e) {
    e.preventDefault();
    browserHistory.push("/dashboard");
    this.props.clear();
  }

  accessWallet(e) {
    e.preventDefault();
    browserHistory.push("/buy_currency");
    this.props.clear();
  }

  accessNotifications(e) {
    e.preventDefault();
    this.props.onAccessNotes();
  }

  logout(e){
    e.preventDefault();
    this.props.clear();
    Meteor.logout(function(err) {
      if(err){
        toastr.error(err.reason);
      }
      browserHistory.push("/");
    })
  }

  render() {
    return (
      <div className="user-dropdown col" style={{alignItems: "flex-end", display: this.props.active ? "inherit" : "none"}}>
        <div className="triangle-top"></div>
        <div className="user-dropdown-content col">
          <a className="user-dropdown-option row x-center" href="#" onClick={this.accessProfile.bind(this)}>
            <div className="user-dropdown-icon"><i className="fa fa-user fa-2x" aria-hidden="true"></i></div>
            <span className="col-3">Profile</span>
          </a>
          {
            // <a className="user-dropdown-option row x-center" href="#" onClick={this.accessWallet.bind(this)}>
            //   <div className="user-dropdown-icon"><i className="fa fa-usd fa-2x" aria-hidden="true"></i></div>
            //   <span className="col-3">Wallet</span>
            // </a>
          }
          <a className="user-dropdown-option row x-center" href="#" onClick={this.accessOptions.bind(this)}>
            <div className="user-dropdown-icon">
              <i className="fa fa-cog fa-2x" aria-hidden="true"></i>
            </div>
            <span className="col-3">Options</span>
          </a>
          <a className="user-dropdown-option row x-center" href="#" onClick={this.accessNotifications.bind(this)}>
            <div className="user-dropdown-icon" style={{position: "relative"}}>
              <i className="fa fa-envelope fa-2x" aria-hidden="true"></i>
              <span style={{fontSize: 16, position: "absolute", right: 2.5, bottom: -10, fontWeight: "bold", color: "#FF6000"}}>
                {
                  Notifications.find().fetch().length
                }
              </span>
            </div>
            <span className="col-3">Notifications</span>
          </a>
          <a className="user-dropdown-option row x-center" href="#" onClick={this.logout.bind(this)}>
            <div className="user-dropdown-icon"><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></div>
            <span className="col-3">Logout</span>
          </a>
        </div>
      </div>
    );

  }
}
