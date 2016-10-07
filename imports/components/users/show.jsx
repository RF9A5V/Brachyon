import React from 'react';
import TrackerReact from 'meteor/ultimatejs:tracker-react';
import FontAwesome from 'react-fontawesome';
import { browserHistory, Link } from "react-router"
import Modal from "react-modal";

import Games from '/imports/api/games/games.js';
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { Images } from "/imports/api/event/images.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";

import EventBlock from '../events/block.jsx';
import EventDisplay from '../events/display.jsx';
import CreditCardForm from '../public/credit_card.jsx';
import ProfileImage from './profile_image.jsx';
import ImageForm from "/imports/components/public/img_form.jsx";
import UserSections from "./show/sections.jsx";

export default class ShowUserScreen extends TrackerReact(React.Component) {

  componentWillMount() {
    self = this;
    this.setState({
      events: Meteor.subscribe('userEvents', Meteor.userId()),
      currentEvent: null,
      open: false
    });
  }

  componentWillUnmount(){
    this.state.events.stop();
  }

  image(id) {
    return Images.find({ _id: id }).fetch()[0];
  }

  createEvent(event) {
    event.preventDefault();
    Meteor.call('events.create');
  }

  updateDisplay(currentEvent){
    return function(e){
      this.setState({currentEvent});
    }
  }

  onLogOut(e){
    e.preventDefault();
    Meteor.logout();
  }

  imgUrl(id) {
    var img = Images.findOne(id);
    if(img) {
      return img.link();
    }
    else {
      return "/images/bg.jpg";
    }
  }

  profileBannerURL(id) {
    var banner = ProfileBanners.findOne(Meteor.user().profile.banner);
    if(banner){
      return banner.link();
    }
    return "/images/bg.jpg";
  }

  gameBannerURL(id) {
    return Images.findOne(id).link();
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
  }

  onImageUploaded(data) {
    Meteor.call("users.update_profile_image", data._id, (err) => {
      if(err) {
        toastr.error(err.reason, "Error!");
      }
      else {
        this.setState({
          open: false
        })
        toastr.success("Updated profile image.", "Success!");
      }
    })
  }

  render() {
    var self = this;

    if(!this.state.events.ready()){
      return (
        <div>
          Loading...
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
                  console.log(g);
                  return (
                    <div className="user-game-icon" style={{backgroundImage: `url(${Images.findOne(g.banner).link()})`}} key={i}>

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
                  <ImageForm ref="img" collection={ProfileImages} callback={this.onImageUploaded.bind(this)} />
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
          <UserSections />
        </div>
      </div>
    )

  }
}
