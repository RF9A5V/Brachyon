import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class UserDropdown extends Component {

  accessOptions(e) {
    e.preventDefault();
    browserHistory.push("/options");
    this.props.clear();
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
    if(this.props.active){
      return (
        <div className="user-dropdown col" style={{alignItems: "flex-end"}}>
          <div className="triangle-top"></div>
          <div className="user-dropdown-content col">
            <a className="user-dropdown-option" href="#" onClick={this.accessOptions.bind(this)}>
              <FontAwesome style={{marginRight: 15}} name="cog" size="2x" />
              <span>Options</span>
            </a>
            <a className="user-dropdown-option" href="#" onClick={this.logout.bind(this)}>
              <FontAwesome name="sign-out" size="2x" style={{marginRight: 15}} />
              <span>Logout</span>
            </a>
          </div>
        </div>
      );
    }
    return (
      <div></div>
    )
  }
}
