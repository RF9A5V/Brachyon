import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import Notifications from "/imports/api/users/notifications.js";

export default class UserDropdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  componentWillReceiveProps(next) {
    if(!next.active) {
      this.setState({ open: false })
    }
  }

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

  accessOrgs(e) {
    e.preventDefault();
    browserHistory.push("/orgs/create");
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
        <div className="triangle-top" style={{display: this.state.open ? "none" : "inherit"}}></div>
        <div className="user-dropdown-content col" style={{display: this.state.open ? "none" : "inherit"}}>
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
          <a className="user-dropdown-option row x-center" href="#" onClick={(e) => { e.preventDefault(); this.props.onAccessNotes(); }}>
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
          <a className="user-dropdown-option row x-center" href="#" onClick={this.accessOrgs.bind(this)}>
            <div className="user-dropdown-icon"><i className="fa fa-users fa-2x" aria-hidden="true"></i></div>
            <span className="col-3">Create Orgs</span>
          </a>
          <a className="user-dropdown-option row x-center" href="#" onClick={(e) => {
            e.preventDefault();
            this.setState({ open: true })
          }}>
            <div className="user-dropdown-icon"><i className="fa fa-address-book fa-2x" aria-hidden="true"></i></div>
            <span className="col-3">Show Orgs</span>
          </a>
          <a className="user-dropdown-option row x-center" href="#" onClick={this.logout.bind(this)}>
            <div className="user-dropdown-icon"><i className="fa fa-sign-out fa-2x" aria-hidden="true"></i></div>
            <span className="col-3">Logout</span>
          </a>
        </div>
        <div className="org-sidebar" style={{display: this.state.open ? "block" : "none"}} onBlur={() => { this.setState({ open: false }) }}>
          {
            Organizations.find().map((o) => {
              return (
                <div className="org-option row x-center" onClick={() => { browserHistory.push(`/org/${o.slug}`) }}>
                  <img src={o.details.profileUrl} />
                  <span>{ o.name }</span>
                </div>
              )
            })
          }
        </div>
      </div>
    );

  }
}
