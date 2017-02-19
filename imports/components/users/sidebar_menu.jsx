import React, { Component } from "react";
import FontAwesome from "react-fontawesome";
import { browserHistory } from "react-router";

export default class SidebarMenu extends Component {

  options() {
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
      {
        icon: "envelope",
        name: "Notifications",
        action: () => {
          // Do nothing for now.
        }
      },
      {
        icon: "users",
        name: "Create Organizations",
        action: () => {
          browserHistory.push("/orgs/create");
        }
      },
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
        <div className="row x-center hover-orange" style={{alignSelf: "stretch", padding: 20}} onClick={() => {
          (i.action)();
          this.props.onRedirect();
        }}>
          <FontAwesome name={i.icon} size="2x" style={{width: 50, marginRight: 10}} />
          <div className="col-3">
            <span style={{fontSize: 18}}>{ i.name }</span>
          </div>
        </div>
      )
    })
  }

  render() {
    var user = Meteor.user();
    if(!user) {
      return null;
    }
    return (
      <div style={{height: "100vh", backgroundColor: "#111", width: 250}}>
        <div className="col x-center">
          <div className="col x-center" style={{padding: 20}}>
            <img src={user && user.profile.imageUrl ? user.profile.imageUrl : "/images/profile.png"} style={{width: 100, height: 100, borderRadius: "100%", marginBottom: 10}}/>
            <span style={{fontSize: 18}}>{ user.username }</span>
          </div>
          { this.options() }
        </div>
      </div>
    )
  }
}
