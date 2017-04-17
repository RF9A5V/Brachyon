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
        <div className="row hover-orange x-center" style={{padding: ops.padding, width: "100%"}} onClick={() => {
          (i.action)();
          this.props.onRedirect();
        }}>
          <div className="col-1"></div>
          <div className="col-1">
            <FontAwesome name={i.icon} style={{width: 50, marginRight: ops.marginRight, fontSize: ops.fontSize}} />
          </div>
          <span className="col-3" style={{fontSize: ops.fontSize}}>{ i.name }</span>
          <div className="col-1"></div>
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
      <div className="col" style={{height: "100vh", backgroundColor: "black", width: ops.width, padding: 20}}>
        <div className="col-1">
          <div className="row" style={{justifyContent: "flex-end"}}>
            <FontAwesome name="times" style={{fontSize: ops.fontSize}} onClick={this.props.onRedirect}/>
          </div>
          <div className="col x-center" style={{padding: ops.padding}}>
            <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: ops.imgSize, height: ops.imgSize, borderRadius: "100%", marginBottom: 10}}/>
            <span style={{fontSize: ops.fontSize}}>{ user.username }</span>
          </div>
        </div>
        <div className="col center x-center">
          { this.options(ops) }
        </div>
        <div className="col-1"></div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      width: "75vw",
      imgSize: "30vw",
      fontSize: "6rem",
      padding: "5em",
      marginRight: 30
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
