import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import FontAwesome from "react-fontawesome";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import LoaderContainer from "/imports/components/public/loader_container.jsx";

import UserBio from "./profile/bio.jsx";
import UserStats from "./show/stat.jsx";
import UserEvents from "./profile/events.jsx";

class UserProfile extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tab: "bio"
    }
  }

  userTabs(opts) {
    const tabs = ["bio", "stats", "T.O.", "player"];
    return (
      <div className="row center">
        {
          tabs.map((tab)=>{
            const isCurrentTab = this.state.tab == tab;
            const tabStyle = {
              borderBottom: isCurrentTab ?"solid 2px":"",
              borderColor: isCurrentTab ? "#ff6000":"",
              fontSize: opts.fontSize
            }
            return (
              <div className="user-tab title" style={tabStyle} onClick={()=>{this.setState({tab})}}>{tab.toUpperCase()}</div>
            )
          })
        }
      </div>
    )
  }

  userTabContent() {
    switch(this.state.tab) {
      case "bio":
        return (
          <UserBio {...this.props.params} />
        );
      case "stats":
        return (
          <UserStats />
        );
      case "T.O.":
        return (
          <UserEvents type={this.state.tab} {...this.props.params} />
        );
      case "player":
        return (
          <UserEvents type={this.state.tab} {...this.props.params} />
        );
      default:
        return null;
    }
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.props.ready} onReady={() => { this.setState({ ready: true }) }} />
      )
    }
    const user = Meteor.user();
    const mediaStyle = {
      width: 35,
      height: 35,
      padding: 5,
      backgroundColor: "#111"
    }
    const mediaLinks = (() => {
      const types = [
        "facebook",
        "twitter",
        "twitch",
        "instagram",
        "snapchat",
        "youtube"
      ];
      return types.map(t => {
        return (
          <div className="row center x-center" style={mediaStyle}>
            <FontAwesome name={t} style={{fontSize: opts.iconSize}} />
          </div>
        )
      })
    })();

    const bannerStyle = {
      width: "100%", height: "calc(100vw * 4.5 / 16)",
      backgroundImage: `url(${user.profile.bannerUrl || "/images/bg.jpg"})`,
      backgroundSize: "100% auto",
      backgroundPositionY: "50%",
      position: "relative", justifyContent: "flex-end"
    }

    return (
      <div>
        <div className="row" style={bannerStyle}>
          <img src={user.profile.imageUrl || "/images/profile.png"} style={{position: "absolute", width: opts.imgDim, height: opts.imgDim, bottom: -(opts.imgDim / 2), left: (opts.imgDim / 3), borderRadius: "100%"}} />
          <div className="col" style={{justifyContent: "flex-end"}}>
            <div className="row">
              { mediaLinks }
            </div>
          </div>
        </div>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <div className="col" style={{width: 210}}>
            <span style={{fontSize: 22}}>~{user.profile.alias || user.username}</span>
            <span style={{fontSize: 14}}>@{user.username}</span>
          </div>
        </div>
        {
          this.userTabs(opts)
        }
        <hr className="user-divider" />
        <div style={{minHeight: "calc(100vh - (100vw * 4.5 / 16) + 10vh)"}}>
          {
            this.userTabContent()
          }
        </div>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      imgDim: 125,
      iconSize: "2em",
      fontSize: "1em"
    });
  }

  renderMobile() {
    return this.renderBase({
      mobile: true,
      imgDim: 200,
      fontSize: "3.5em",
      fontSize: "2.5em"
    });
  }

}

export default createContainer((props) => {
  const userSub = Meteor.subscribe("getUserByUsername", props.params.username);
  return {
    ready: userSub.ready()
  }
}, UserProfile);
