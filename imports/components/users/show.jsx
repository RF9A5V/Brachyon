import React, { Component } from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory, Link } from "react-router"
import Modal from "react-modal";

import Games from '/imports/api/games/games.js';
import { Banners } from "/imports/api/event/banners.js";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { GameBanners } from "/imports/api/games/game_banner.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';
import ProfileImage from './profile_image.jsx';
import ImageForm from "/imports/components/public/img_form.jsx";
import UserSections from "./show/sections.jsx";
import UserStat from "./show/stat.jsx";
import Loading from "/imports/components/public/loading.jsx";

import ResponsiveComponent from "/imports/components/public/responsive_component.jsx";

export default class ShowUserScreen extends TrackerReact(ResponsiveComponent) {

  componentWillMount() {
    super.componentWillMount()
    self = this;
    this.setState({
      user: Meteor.subscribe("user", Meteor.userId(), {
        onReady: () => {

          this.setState({

            ready: true
          })
        }
      }),
      open: false,
      ready: false,
      tab: "events",
      game:"overview"
    });
  }

  componentWillUnmount(){
    super.componentWillUnmount();
    this.state.user.stop();
  }

  profileBannerURL(id) {
    var user = Meteor.user();
    if(user.profile.bannerUrl){
      return user.profile.bannerUrl;
    }
    return "/images/bg.jpg";
  }

  profileImage() {
    var user = Meteor.user();
    if(user.profile.imageUrl) {
      return user.profile.imageUrl;
    }
    return "/images/profile.png";
  }

  updateProfileImage(e) {
    e.preventDefault();
    this.refs.img.value();
    var { image, meta, type } = this.refs.img.value();
    meta.userId = Meteor.userId();
    ProfileImages.insert({
      file: image,
      meta,
      fileName: Meteor.userId() + "_profile." + type,
      onUploaded: (err) => {
        if(err) {
          toastr.error(err.reason);
          throw new Error(err.reason);
        }
        toastr.success("Uploaded profile image!");
        this.setState({open: false});
      }
    })
  }

  tabContent() {
    if(this.state.tab=="events"){
      return (<UserSections/>)
    }
    else if (this.state.tab=="stats"){
      return(<UserStat/>)
    }
  }

  renderBase(opts) {
    var self = this;

    if(!this.state.ready){
      return (
        <div className="row center x-center" style={{width: "100%", height: "100%"}}>
          <Loading />
        </div>
      )
    }

    return (
      <div style={{marginBottom: opts.marginBottom}}>
        <div className="user-banner" style={{backgroundImage: `url(${this.profileBannerURL()})`}}>
          <div className="user-img-line row flex-pad x-center">
            <div className="row col-1">
              {
                // Meteor.user().profile.games.slice(0, 3).map((game, i) => {
                //   var g = Games.findOne(game);
                //   return (
                //     <div className="user-game-icon" style={{backgroundImage: `url(${g.bannerUrl})`}} key={i}>
                //     </div>
                //   );
                // })
              }
            </div>
            <div className="user-profile-image" onClick={() => { this.setState({ open: true }) }}>
              <img src={this.profileImage()} style={{width: "100%", height: "100%", borderRadius: "100%"}} />
              <div className="user-profile-overlay">
                Add Image
              </div>
              <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
                <div className="col center x-center" style={{width: "100%", height: "100%"}}>
                  <ImageForm ref="img" meta={{userId: Meteor.userId()}} />
                  <button onClick={this.updateProfileImage.bind(this)}>Submit</button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        {
          <div className="row center" style={{paddingTop: "100px"}}>
            {
              ["events","stats"].map((tab)=>{
                return (
                  <div className="user-tab title" style={{borderBottom:`${this.state.tab==tab?"solid 2px":""}`, borderColor:`${this.state.tab==tab?"#ff6000":""}`}} onClick={()=>{this.setState({tab})}}>{tab.toUpperCase()}</div>
                )})
            }
          </div>
        }
        <div className="row col-1"><hr className="user-divider" style={{marginTop: "-1px"}}></hr></div>
        <div className="col">
          {this.tabContent()}
        </div>
      </div>
    )
  }

  renderMobile() {
    return this.renderBase({
      marginBottom: 200
    })
  }

  renderDesktop() {
    return this.renderBase({
      marginBottom: 0
    })
  }

}
