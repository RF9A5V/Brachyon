import React, { Component } from "react";
import TrackerReact from 'meteor/ultimatejs:tracker-react';

import ImageForm from "../../public/img_form.jsx";
import { ProfileImages } from "/imports/api/users/profile_images.js";
import { ProfileBanners } from "/imports/api/users/profile_banners.js";
import Loading from "/imports/components/public/loading.jsx";

export default class UserDetailsPanel extends TrackerReact(Component) {

  constructor(props) {
    super(props);
    this.state = {
      profileChanged: false,
      user: Meteor.subscribe("user", Meteor.userId()),
      image: Meteor.user().profile.imageUrl,
      banner: Meteor.user().profile.bannerUrl,
    }
  }

  componentWillUnmount() {
    this.state.user.stop();
  }

  onRequestImageSave(type) {
    var ref = type == "image" ? this.refs.profileImage : this.refs.profileBanner;
    this.saveImage(ref);
    return toastr.success("Successfully updated profile " + type + "!");
  }

  saveImage(ref) {
    if(!ref.hasValue()) {
      return toastr.error("You have to supply an image for this!", "Error!");
    }
    var self = this;
    ref.value((err, data) => {
      if(err) {
        return toastr.error(err);
      }
      ref.reset();
    });
  }

  saveAlias(e) {
    e.preventDefault();
    if(Meteor.user() && Meteor.user().profile.alias != this.refs.alias.value) {
      Meteor.call("users.update_alias", this.refs.alias.value, this.genericError("alias").bind(this));
    }
    else {
      toastr.warning("No changes to be made.", "Warning!");
    }
  }

  render() {
    return (
      <div className="col side-tab-panel" style={{margin:"auto", paddingTop:10}}>
        <h4>Profile Image</h4>
        <div className="about-what" style={{marginBottom:10}}>
          <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={() => { this.onRequestImageSave("image") }}>Save</button>
          </div>
          <ImageForm aspectRatio={1} collection={ProfileImages} ref="profileImage" url={Meteor.user().profile.imageUrl} meta={{userId: Meteor.userId()}}/>

        </div>
        <h4>Profile Banner</h4>
        <div className="about-what" style={{marginBottom:10}}>
          <div style={{display:"flex", justifyContent:"flex-end"}}>  
            <button onClick={() => { this.onRequestImageSave("banner") }}>Save</button>
          </div>
          <ImageForm aspectRatio={16/4.5} collection={ProfileBanners} ref="profileBanner" url={Meteor.user().profile.bannerUrl} meta={{userId: Meteor.userId()}} />
        </div>

        <h4 className="col-1">Alias</h4>
        <div className="about-what" style={{marginBottom:10}}>
          <div style={{display:"flex", justifyContent:"flex-end"}}>
            <button onClick={this.saveAlias.bind(this)}>Save</button>
          </div>
          <div>
            <input type="text" ref="alias" style={{width: 400}} maxLength={40} defaultValue={Meteor.user().profile.alias || Meteor.user().username} />
          </div>
        </div>
      </div>
    );
  }
}
