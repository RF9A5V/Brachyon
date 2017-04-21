import React, { Component } from "react";
import { createContainer } from "meteor/react-meteor-data";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";

import { ProfileBanners } from "/imports/api/users/profile_banners.js";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";
import LoaderContainer from "/imports/components/public/loader_container.jsx";
import ImageForm from "/imports/components/public/img_form.jsx";

import UserBio from "./profile/bio.jsx";
import UserStats from "./show/stat.jsx";
import UserEvents from "./profile/events.jsx";
import UserImage from "./profile/image.jsx";

class UserProfile extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tab: "bio",
      editMode: false,
      hover: false,
      open: false
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
              fontSize: opts.fontSize,
              color: this.state.editMode && tab != "bio" ? "#666" : "white",
              marginTop: opts.mobile ? 30 : 0
            }
            return (
              <div className="user-tab title" style={tabStyle} onClick={() => {
                if(this.state.editMode) {
                  return;
                }
                this.setState({
                  tab
                })
              }}>
                {tab.toUpperCase()}
              </div>
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
          <UserBio {...this.props.params} editMode={this.state.editMode} />
        );
      case "stats":
        return (
          <UserStats editMode={this.state.editMode} {...this.props.params} />
        );
      case "T.O.":
        return (
          <UserEvents type={this.state.tab} {...this.props.params} editMode={this.state.editMode} />
        );
      case "player":
        return (
          <UserEvents type={this.state.tab} {...this.props.params} editMode={this.state.editMode} />
        );
      default:
        return null;
    }
  }

  saveBannerImg() {
    var { image, meta, type } = this.refs.banner.value();
    meta.userId = Meteor.userId();
    ProfileBanners.insert({
      file: image,
      meta,
      fileName: Meteor.userId() + "." + type,
      onUploaded: (err) => {
        if(err) {
          toastr.error(err.reason);
          throw new Error(err.reason);
        }
        toastr.success("Updated profile banner!");
        this.setState({
          open: false
        })
      }
    })
  }

  renderBase(opts) {
    if(!this.state.ready) {
      return (
        <LoaderContainer ready={this.props.ready} onReady={() => { this.setState({ ready: true }) }} />
      )
    }

    const user = Meteor.users.findOne({
      username: this.props.params.username
    });
    const mediaStyle = {
      width: opts.mobile ? 80 : 35,
      height: opts.mobile ? 80 : 35,
      padding: 5,
      backgroundColor: "rgba(0, 0, 0, 0.5)"
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
      backgroundImage: `${this.state.hover ? "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), " : ""} url(${user.profile.bannerUrl || "/images/bg.jpg"})`,
      backgroundSize: "cover",
      backgroundPositionY: "50%",
      position: "relative", justifyContent: "flex-end"
    }

    return (
      <div>
        <div className="row" style={bannerStyle} onMouseEnter={() => {
          if(this.state.editMode) {
            this.setState({
              hover: true
            })
          }
        }} onMouseLeave={() => {
          this.setState({
            hover: false
          })
        }} onClick={() => {
          if(this.state.editMode) {
            this.setState({
              open: true
            })
          }
        }}>
          <UserImage username={this.props.params.username} editMode={this.state.editMode} />
          <div className="col col-1 flex-pad">
            {
              user._id == Meteor.userId() ? (
                <div className="row" style={{justifyContent: "flex-end", padding: 10}}>
                  <button onClick={(e) => {
                    e.preventDefault();
                    this.setState({
                      editMode: !this.state.editMode,
                      tab: "bio"
                    })
                  }}>
                    { this.state.editMode ? "View" : "Edit" }
                  </button>
                </div>
              ) : (
                <div></div>
              )
            }
            {
              this.state.hover ? (
                <div className="row center">
                  <span>Edit Banner</span>
                </div>
              ) : (
                null
              )
            }
            <div className="row" style={{justifyContent: "flex-end"}}>
              { mediaLinks }
            </div>
          </div>
        </div>
        <div className="row" style={{justifyContent: "flex-end"}}>
          <div className="col" style={{width: opts.mobile ? 80 * 6 : 35 * 6}}>
            <span style={{fontSize: `calc(${opts.fontSize} * 1.2)`}}>~{user.profile.alias || user.username}</span>
            <span style={{fontSize: `calc(${opts.fontSize} * 0.6)`}}>@{user.username}</span>
          </div>
        </div>
        {
          this.userTabs(opts)
        }
        <hr className="user-divider" style={{marginTop: -2}} />
        <div style={{minHeight: "calc(100vh - (100vw * 4.5 / 16) + 10vh)"}}>
          {
            this.userTabContent()
          }
        </div>
        <Modal isOpen={this.state.open} onRequestClose={() => {
          this.setState({
            open: false
          })
        }}>
          <div style={{width: "50%", margin: "0 auto"}}>
            <ImageForm url={user.profile.bannerUrl} aspectRatio={16/4.5} ref="banner" />
          </div>
          <div className="row center">
            <button onClick={this.saveBannerImg.bind(this)}>
              Save
            </button>
          </div>
        </Modal>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      iconSize: "2em",
      fontSize: "1em"
    });
  }

  renderMobile() {
    return this.renderBase({
      mobile: true,
      fontSize: "3.5em",
      iconSize: "4em"
    });
  }

}

export default createContainer((props) => {
  const userSub = Meteor.subscribe("getUserByUsername", props.params.username);
  return {
    ready: userSub.ready()
  }
}, UserProfile);
