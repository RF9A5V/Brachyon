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

import ExternLink from "/imports/decorators/get_extern_link.js";

class UserProfile extends ResponsiveComponent {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      tab: "bio",
      editMode: false,
      hover: false,
      open: false,
      preview: null,
      progress: 0
    }
  }

  userTabs(opts) {
    const tabs = ["bio", "stats", "hosting", "playing"];
    return (
      <div className="row center">
        {
          tabs.map((tab)=>{
            const isCurrentTab = this.state.tab == tab;
            const tabStyle = {
              borderBottom: isCurrentTab ?"solid 2px":"",
              borderColor: isCurrentTab ? "#ff6000":"",
              fontSize: "1em",
              color: this.state.editMode && tab != "bio" ? "#666" : "white",
              marginTop: opts.mobile ? 30 : 0,
              padding: "1em"
            }
            return (
              <div className="user-tab title noselect" style={tabStyle} onClick={() => {
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
    const tabs = [
      {
        ref: "bio",
        comp: UserBio
      },
      {
        ref: "stats",
        comp: UserStats
      },
      {
        ref: "hosting",
        comp: UserEvents
      },
      {
        ref: "playing",
        comp: UserEvents
      }
    ];
    return tabs.map(t => {
      return (
        <div style={{display: this.state.tab == t.ref ? "inherit" : "none"}}>
          <t.comp {...this.props.params} editMode={this.state.editMode} type={t.ref} ref={t.ref} />
        </div>
      )
    })
  }

  saveBannerImg() {
    var preview = this.refs.banner.getPreview();
    var { image, meta, type } = this.refs.banner.value();
    meta.userId = Meteor.userId();
    this.setState({
      preview
    }, () => {
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
        },
        onProgress: (prog, file) => {
          this.setState({
            progress: prog
          });
        }
      })
    })
  }

  saveAll() {
    var bioDetails = this.refs.bio.value();
    bioDetails.username = this.refs.username.value;
    bioDetails.alias = this.refs.alias.value;
    Meteor.call("user.saveProfileDetails", bioDetails, (err) => {
      if(err) {
        toastr.error(err.reason);
      }
      else {
        this.setState({
          editMode: false
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
      width: 35,
      height: 35,
      padding: 5,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      cursor: "pointer"
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
        const service = user.services[t];
        if(!service) {
          return null;
        }
        return (
          <div className="row center x-center" style={mediaStyle} onClick={(e) => {
            window.open(ExternLink[t](service));
          }}>
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
      position: "relative",
      justifyContent: "flex-end"
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
          <div className="col col-1 flex-pad">
            <div className="row" style={{justifyContent: "flex-end", padding: 10, backgroundColor: "rgba(0, 0, 0, 0.7)"}}>
              <div className="col">
                {
                  this.state.editMode ? (
                    <div className="row" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                      <div className="col col-1" style={{marginRight: 10}}>
                        <label className="input-label">Alias</label>
                        <input type="text" defaultValue={user.profile.alias || user.username} style={{margin: 0}} ref="alias" />
                      </div>
                      <div className="col col-1">
                        <label className="input-label">Username</label>
                        <input type="text" defaultValue={user.username} style={{margin: 0}} ref="username" />
                      </div>
                    </div>
                  ) : (
                    [
                      <span style={{fontSize: opts.aliasFontSize}}>~{user.profile.alias || user.username}</span>,
                      <span style={{fontSize: opts.userFontSize}}>@{user.username}</span>
                    ]
                  )
                }
              </div>
            </div>
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
        <div className="row" style={{justifyContent: "flex-end", padding: 10, position: "relative"}}>
          <UserImage username={this.props.params.username} editMode={this.state.editMode} />
          {
            this.state.editMode ? (
              <button onClick={() => {
                this.setState({
                  editMode: false
                })
              }} style={{marginRight: 10}}>
                <FontAwesome name="times" style={{marginRight: 10}} />
                <span>
                  Cancel
                </span>
              </button>
            ) : (
              null
            )
          }
          {
            user._id == Meteor.userId() ? (
              <button onClick={(e) => {
                e.preventDefault();
                if(this.state.editMode) {
                  this.saveAll();
                }
                else {
                  this.setState({
                    editMode: true,
                    tab: "bio"
                  });
                }
              }}>
                <div className="row x-center">
                  {
                    this.state.editMode ? (
                      [
                        <FontAwesome name="floppy-o" style={{marginRight: 10}} />,
                        <span>Save Profile</span>
                      ]
                    ) : (
                      [
                        <FontAwesome name="pencil" style={{marginRight: 10}} />,
                        <span>Edit Profile</span>
                      ]
                    )
                  }
                </div>
              </button>
            ) : (
              null
            )
          }

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
            {
              this.state.preview ? (
                <div>
                  <div className="row flex-end" style={{position: "relative"}}>
                    <img src={this.state.preview} style={{width: "100%", height: "auto", alignSelf: "flex-start"}} />
                    <div style={{position: "absolute", top: 0, right: 0, width: `${100 - this.state.progress}%`, height: "100%", backgroundColor: "rgba(0, 0, 0, 0.8)"}}>
                    </div>
                  </div>
                  <div className="row center" style={{marginTop: 10}}>
                    <span>Uploading...</span>
                  </div>
                </div>
              ) : (
                <ImageForm url={user.profile.bannerUrl} aspectRatio={16/4.5} ref="banner">
                  <button onClick={this.saveBannerImg.bind(this)} style={{marginLeft: 10}} className={opts.buttonClass}>
                    Save
                  </button>
                </ImageForm>
              )
            }
          </div>
        </Modal>
      </div>
    )
  }

  renderDesktop() {
    return this.renderBase({
      mobile: false,
      iconSize: "1.2em",
      fontSize: "1em",
      userFontSize: "1em",
      aliasFontSize: "1.2em",
      buttonClass: ""
    });
  }

  renderMobile() {
    return this.renderBase({
      mobile: true,
      fontSize: "1.2em",
      iconSize: "1em",
      userFontSize: "1em",
      aliasFontSize: "1.2em"
    });
  }

}

export default createContainer((props) => {
  const userSub = Meteor.subscribe("getUserByUsername", props.params.username);
  return {
    ready: userSub.ready()
  }
}, UserProfile);
