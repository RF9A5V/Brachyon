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

  render() {
    const user = Meteor.user();
    return (
      <div className="col">
        <label>Social Media</label>
        {
          this.socialComponents()
        }
        <label>Email</label>
        <div className="row" style={{marginBottom: 10}}>
          <input className="col-1" type="text" defaultValue={user.emails[0].address} style={{margin: 0}} />
          <button style={{marginLeft: 10}}>Save</button>
        </div>
        <label>Username</label>
        <div className="row">
          <input className="col-1" type="text" defaultValue={user.username} style={{margin: 0}} />
          <button style={{marginLeft: 10}}>Save</button>
        </div>
      </div>
    )
  }
}
