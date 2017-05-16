import React, { Component } from "react";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import RowLayout from "/imports/components/public/row_layout.jsx";

import OauthOption from "./oauth_option.jsx";

export default class UserAccount extends ResponsiveComponent {

  socialComponents() {
    var social = [
      {
        type: "facebook",
        color: "#3B5998"
      },
      {
        type: "twitter",
        color: "#1DA1F2"
      },
      {
        type: "twitch",
        color: "#6441A5"
      },
      {
        type: "instagram",
        color: "#405DE6"
      }
    ];
    return (
      <RowLayout length={4}>
        {
          social.map(s => {
            return (
              <OauthOption {...s} />
            )
          })
        }
      </RowLayout>
    )
  }

  changeUsername() {
    const username = this.refs.username.value;
    Meteor.call("user.updateUsername", username, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated username!");
      }
    })
  }

  changeEmail() {
    const email = this.refs.email.value;
    Meteor.call("user.updateEmail", email, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated email!");
      }
    })
  }

  changePassword() {
    const currentPW = this.refs.pw.value;
    const newPW = this.refs.newPW.value;
    const confirmPW = this.refs.confirm.value;
    if(newPW != confirmPW) {
      return toastr.error("Passwords must match!");
    }
    Accounts.changePassword(currentPW, newPW, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        toastr.success("Successfully updated password!");
      }
    });
  }

  render() {
    const user = Meteor.user();
    return (
      <div className="col">
        <label>Social Media</label>
        {
          this.socialComponents()
        }
        <label>Username</label>
        <div className="row" style={{marginBottom: 10}}>
          <input className="col-1" type="text" ref="username" defaultValue={user.username} style={{margin: 0}} />
          <button style={{marginLeft: 10}} onClick={this.changeUsername.bind(this)}>Save</button>
        </div>
        <label>Email</label>
        <div className="row" style={{marginBottom: 10}}>
          <input className="col-1" type="text" ref="email" defaultValue={user.emails[0].address} style={{margin: 0}} />
          <button style={{marginLeft: 10}} onClick={this.changeEmail.bind(this)}>Save</button>
        </div>
        <label>Change Password</label>
        <div className="col col-1" style={{marginBottom: 10}}>
          <input type="password" ref="pw" placeholder="Your Current Password" style={{margin: 0, marginBottom: 10}} />
          <input type="password" ref="newPW" placeholder="Your New Password" style={{margin: 0, marginBottom: 10}} />
          <input type="password" ref="confirm" placeholder="Confirm New Password" style={{margin: 0}} />
        </div>
        <div className="row center">
          <button onClick={this.changePassword.bind(this)}>Save</button>
        </div>
      </div>
    )
  }
}
