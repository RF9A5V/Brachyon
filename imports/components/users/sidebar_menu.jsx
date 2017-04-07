import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class SidebarMenu extends ResponsiveComponent {

  options(ops) {
    var items = [
      {
        icon: "user",
        name: "Profile",
        action: () => {
          browserHistory.push("/dashboard");
        }
      },
      {
        icon: "cog",
        name: "Options",
        action: () => {
          browserHistory.push("/options")
        }
      },
      // {
      //   icon: "envelope",
      //   name: "Notifications",
      //   action: () => {
      //     // Do nothing for now.
      //   }
      // },
      // {
      //   icon: "users",
      //   name: "Create Organizations",
      //   action: () => {
      //     browserHistory.push("/orgs/create");
      //   }
      // },
      {
        icon: "sign-out",
        name: "Log Out",
        action: () => {
          Meteor.logout(err => {
            if(err) {
              toastr.error(err.reason);
            }
            else {
              browserHistory.push("/");
            }
          })
        }
      }

    ];
    return items.map(i => {
      return (
        <div className="row x-center hover-orange" style={{padding: ops.padding, width: "100%"}} onClick={() => {
          (i.action)();
          this.props.onRedirect();
        }}>
          <FontAwesome name={i.icon} style={{width: 50, marginRight: ops.marginRight, fontSize: ops.fontSize}} />
          <div className="col-3">
            <span style={{fontSize: ops.fontSize}}>{ i.name }</span>
          </div>
        </div>
      )
    })
  }

  renderBase(ops) {
    var user = Meteor.user();
    if(!user) {
      return null;
    }
    return (
      <div className="col x-center" style={{height: "100vh", backgroundColor: "black", width: ops.width}}>
        <div className="col col-1 center x-center">
          <div className="col x-center" style={{padding: ops.padding}}>
            <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: ops.imgSize, height: ops.imgSize, borderRadius: "100%", marginBottom: 10}}/>
            <span style={{fontSize: ops.fontSize}}>{ user.username }</span>
          </div>
          { this.options(ops) }
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      width: "75vw",
      imgSize: "20em",
      fontSize: "4em",
      padding: "5em",
      marginRight: "1em"
    })
  }

  renderDesktop() {
    return this.renderBase({
      width: 250,
      imgSize: 100,
      fontSize: 18,
      padding: 20,
      marginRight: 10
    })
  }
}
