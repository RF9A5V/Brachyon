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
import Loading from "/imports/components/public/loading.jsx";

export default class ShowUserScreen extends TrackerReact(Component) {

  componentWillMount() {
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
      ready: false
    });
  }

  componentWillUnmount(){
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
    this.setState({open: false});
  }

  render() {
    var self = this;

    if(!this.state.ready){
      return (
        <div className="row center x-center" style={{width: "100%", height: "100%"}}>
          <Loading />
        </div>
      )
    }

    return (
      <div>
        <div className="user-banner" style={{backgroundImage: `url(${this.profileBannerURL()})`}}>
          <div className="user-img-line row flex-pad x-center">
            <div className="row col-1">
              {
                Meteor.user().profile.games.slice(0, 3).map((game, i) => {
                  var g = Games.findOne(game);
                  return (
                    <div className="user-game-icon" style={{backgroundImage: `url(${game.bannerUrl})`}} key={i}>
                    </div>
                  );
                })
              }
            </div>
            <div className="user-profile-image" onClick={() => { this.setState({ open: true }) }}>
              <img src={this.profileImage()} style={{width: "100%", height: "100%", borderRadius: "100%"}} />
              <div className="user-profile-overlay">
                Add Image
              </div>
              <Modal isOpen={this.state.open} onRequestClose={() => { this.setState({ open: false }) }}>
                <div className="col center x-center" style={{width: "100%", height: "100%"}}>
                  <ImageForm ref="img" collection={ProfileImages} meta={{userId: Meteor.userId()}} />
                  <button onClick={this.updateProfileImage.bind(this)}>Submit</button>
                </div>
              </Modal>
            </div>
          </div>
        </div>
        <div className="row center">
          <button onClick={() => { browserHistory.push("/events/create") }} style={{marginTop: 100}}>Create an Event</button>
        </div>
        <div className="row col-1"><hr className="user-divider"></hr></div>
        <div className="col">
          <UserSections/>
        </div>
      </div>
    )

  }
}
